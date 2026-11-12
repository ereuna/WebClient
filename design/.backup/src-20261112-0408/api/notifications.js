/**
 * Notifications via AuthService.
 */
import { authApi } from './client.js'

function mapNotification(n) {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body || '',
    read: n.is_read,
    createdAt: n.created_at,
    link: n.action_url || '#',
  }
}

export async function fetchNotifications() {
  const rows = await authApi.get('/notifications')
  return (rows || []).map(mapNotification)
}

export async function markNotificationRead(id) {
  return authApi.patch(`/notifications/${id}/read`, {})
}

export async function markAllNotificationsRead() {
  return authApi.post('/notifications/read-all', {})
}
