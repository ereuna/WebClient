/**
 * Base API client for Ereuna backend services.
 *
 * All requests go through the Vite dev proxy:
 *   /api/auth/*        →  AuthService       (:8000)
 *   /api/repository/*  →  RepositoryService (:8001)
 *   /api/datasets/*    →  DatasetsService   (:8002)
 *   /api/platform/*    →  PlatformService   (:8003)
 *
 * In production, point VITE_*_API_URL at the real service hostnames and remove the proxy.
 */

const AUTH_BASE    = '/api/auth'
const REPO_BASE    = '/api/repository'
const DATASET_BASE = '/api/datasets'
const PLATFORM_BASE = '/api/platform'

// ── Token management ──────────────────────────────────────────────────────────

const ACCESS_TOKEN_KEY  = 'ereuna_access_token'
const REFRESH_TOKEN_KEY = 'ereuna_refresh_token'

export function getToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setToken(token, persistent = false) {
  if (persistent) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  } else {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
  }
}

export function clearToken() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token, persistent = false) {
  if (persistent) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  } else {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, token)
  }
}

export function clearRefreshToken() {
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

// ── Fetch wrapper ─────────────────────────────────────────────────────────────

// Prevents concurrent refresh races: store the in-flight refresh promise.
let _refreshPromise = null

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  if (!_refreshPromise) {
    _refreshPromise = fetch(`${AUTH_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const persistent = Boolean(localStorage.getItem(ACCESS_TOKEN_KEY))
        setToken(data.access_token, persistent)
        setRefreshToken(data.refresh_token, persistent)
        return data.access_token
      })
      .catch(() => {
        clearToken()
        clearRefreshToken()
        return null
      })
      .finally(() => { _refreshPromise = null })
  }

  return _refreshPromise
}

async function request(base, path, options = {}, { skipRefresh = false } = {}) {
  const token = getToken()
  const isFormData = options.body instanceof FormData
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${base}${path}`, { ...options, headers })

  // Auto-refresh on 401 (but not on the refresh endpoint itself)
  const isRefreshEndpoint = base === AUTH_BASE && path === '/auth/refresh'
  if (res.status === 401 && !skipRefresh && !isRefreshEndpoint) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      return request(base, path, options, { skipRefresh: true })
    }
  }

  if (res.status === 204) return null
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }))
    let detail = body.detail
    if (Array.isArray(detail)) {
      // FastAPI Pydantic v2 validation errors: [{loc, msg, type}, ...]
      detail = detail.map(d => d.msg).join('; ')
    } else if (detail && typeof detail !== 'string') {
      detail = JSON.stringify(detail)
    }
    const err = new Error(detail || `HTTP ${res.status}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

// ── Auth Service client ───────────────────────────────────────────────────────

export const authApi = {
  get:    (path, opts)  => request(AUTH_BASE, path, { method: 'GET', ...opts }),
  post:   (path, body)  => request(AUTH_BASE, path, { method: 'POST',  body: JSON.stringify(body) }),
  patch:  (path, body)  => request(AUTH_BASE, path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path)        => request(AUTH_BASE, path, { method: 'DELETE' }),
}

// ── Repository Service client ─────────────────────────────────────────────────

export const repoApi = {
  get:    (path, opts)  => request(REPO_BASE, path, { method: 'GET', ...opts }),
  post:   (path, body)  => request(REPO_BASE, path, { method: 'POST',   body: JSON.stringify(body) }),
  patch:  (path, body)  => request(REPO_BASE, path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (path)        => request(REPO_BASE, path, { method: 'DELETE' }),

  /** POST with FormData (file uploads) */
  form: (path, formData) =>
    request(REPO_BASE, path, {
      method: 'POST',
      body: formData,
      headers: {},  // let browser set Content-Type with boundary
    }),
}

// ── Datasets Service client ───────────────────────────────────────────────────

export const datasetApi = {
  get:    (path, opts) => request(DATASET_BASE, path, { method: 'GET', ...opts }),
  post:   (path, body) => request(DATASET_BASE, path, { method: 'POST', body: JSON.stringify(body) }),
  delete: (path)       => request(DATASET_BASE, path, { method: 'DELETE' }),
  form:   (path, formData) =>
    request(DATASET_BASE, path, {
      method: 'POST',
      body: formData,
      headers: {},
    }),
}

// ── Platform Service client ───────────────────────────────────────────────────

export const platformApi = {
  get:  (path, opts) => request(PLATFORM_BASE, path, { method: 'GET', ...opts }),
  post: (path, body) => request(PLATFORM_BASE, path, { method: 'POST', body: JSON.stringify(body) }),
}
