/**
 * Public user profiles via AuthService + user repos from RepositoryService.
 */
import { authApi } from './client.js'
import { listRepositories } from './repositories.js'

export async function fetchUser(username) {
  try {
    const profile = await authApi.get(`/users/${username}`)
    let models = []
    let datasets = []
    let repositories = []
    try {
      const repos = await listRepositories({ limit: 200 })
      const userRepos = (repos || []).filter(
        r => (r.metadata?.owner_slug || '').toLowerCase() === username.toLowerCase(),
      )
      models = userRepos
        .filter(r => r.repo_type === 'MODEL')
        .map(r => ({ id: r.slug, name: r.slug, description: r.description || '' }))
      datasets = userRepos
        .filter(r => r.repo_type === 'DATASET')
        .map(r => ({ id: r.slug, name: r.slug, description: r.description || '' }))
      repositories = userRepos.map(r => ({
        id: r.id,
        name: r.slug,
        description: r.description || '',
        type: r.repo_type,
      }))
    } catch { /* ignore */ }

    return {
      username: profile.username,
      fullName: profile.full_name || profile.username,
      bio: profile.bio || '',
      location: profile.location || '',
      website: profile.website || '',
      avatarUrl: profile.avatar_url,
      joinedAt: profile.created_at,
      followers: 0,
      following: 0,
      models,
      datasets,
      repositories,
    }
  } catch {
    throw new Error(`User not found: ${username}`)
  }
}
