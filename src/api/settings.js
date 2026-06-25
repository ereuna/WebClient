/**
 * User settings — profile, sessions, API keys, notification preferences.
 */
import { authApi } from './client.js'

export async function updateProfile(fields) {
  return authApi.patch('/users/me', fields)
}

export async function listSessions() {
  return authApi.get('/sessions')
}

export async function revokeSession(sessionId) {
  return authApi.delete(`/sessions/${sessionId}`)
}

export async function listApiKeys() {
  return authApi.get('/auth/api-keys')
}

export async function createApiKey({ name, scopes = [], expiresInDays = null }) {
  return authApi.post('/auth/api-keys', {
    name,
    scopes,
    expires_in_days: expiresInDays,
  })
}

export async function revokeApiKey(keyId) {
  return authApi.delete(`/auth/api-keys/${keyId}`)
}

export async function getNotificationPreferences() {
  return authApi.get('/notifications/preferences')
}

export async function updateNotificationPreferences(prefs) {
  return authApi.patch('/notifications/preferences', prefs)
}
