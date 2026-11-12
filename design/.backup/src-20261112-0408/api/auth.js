/**
 * Authentication helpers.
 * Targets the Ereuna AuthService (/api/auth → :8000/api/v1).
 */
import {
  authApi,
  setToken,
  clearToken,
  getToken,
  setRefreshToken,
  clearRefreshToken,
  getRefreshToken,
} from './client.js'

/**
 * Sign in with email and password.
 * Stores both access and refresh tokens.
 * Returns the LoginResponse from the server.
 *
 * If MFA is required, resolves with { mfa_required: true, mfa_challenge }.
 * The caller should prompt for the TOTP/backup code and call verifyMfa().
 */
export async function login(email, password, remember = false) {
  const data = await authApi.post('/auth/login', { email, password })

  if (data.mfa_required) {
    return data  // { mfa_required: true, mfa_challenge }
  }

  const { access_token, refresh_token } = data.tokens
  setToken(access_token, remember)
  setRefreshToken(refresh_token, remember)
  return data
}

/**
 * Register a new account.
 * Does NOT automatically log the user in — they must verify their email first.
 */
export async function register(email, username, password) {
  return authApi.post('/auth/register', { email, username, password })
}

/**
 * Sign out. Revokes the refresh token on the server, then clears local storage.
 */
export async function logout() {
  const refreshToken = getRefreshToken()
  try {
    if (refreshToken) {
      await authApi.post('/auth/logout', { refresh_token: refreshToken })
    }
  } catch {
    // Best-effort: clear tokens locally even if the server call fails.
  } finally {
    clearToken()
    clearRefreshToken()
  }
}

export function isAuthenticated() {
  return Boolean(getToken())
}

/**
 * Fetch the currently signed-in user's profile from AuthService.
 * Returns null if unauthenticated. Clears stale tokens when the session
 * cannot be restored (expired refresh token, revoked session, etc.).
 */
export async function fetchCurrentUser() {
  if (!isAuthenticated()) return null

  try {
    return await authApi.get('/users/me')
  } catch (err) {
    if (err.status === 401) {
      clearToken()
      clearRefreshToken()
    }
    return null
  }
}
