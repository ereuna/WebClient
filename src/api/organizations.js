/**
 * Organizations via AuthService.
 */
import { authApi } from './client.js'
import { listRepositories } from './repositories.js'

function mapOrg(org, stats = {}) {
  return {
    id: org.id,
    slug: org.slug,
    name: org.display_name,
    description: org.description || '',
    memberCount: stats.memberCount ?? 0,
    modelCount: stats.modelCount ?? 0,
    datasetCount: stats.datasetCount ?? 0,
    plan: org.plan || 'free',
    createdAt: org.created_at,
    avatar: org.avatar_url,
  }
}

async function countOrgRepos(orgId) {
  try {
    const repos = await listRepositories({ limit: 200 })
    const orgRepos = (repos || []).filter(r => r.owner_org_id === orgId)
    return {
      modelCount: orgRepos.filter(r => r.repo_type === 'MODEL').length,
      datasetCount: orgRepos.filter(r => r.repo_type === 'DATASET').length,
    }
  } catch {
    return { modelCount: 0, datasetCount: 0 }
  }
}

export async function fetchAllOrganizations() {
  const orgs = await authApi.get('/organizations')
  const enriched = await Promise.all(
    (orgs || []).map(async (org) => {
      const stats = await countOrgRepos(org.id)
      let memberCount = 0
      try {
        const members = await authApi.get(`/organizations/${org.id}/members`)
        memberCount = (members || []).length
      } catch { /* ignore */ }
      return mapOrg(org, { ...stats, memberCount })
    }),
  )
  return enriched
}

export async function fetchOrganization(slug) {
  const org = await authApi.get(`/organizations/by-slug/${slug}`)
  const stats = await countOrgRepos(org.id)
  let memberCount = 0
  try {
    const members = await authApi.get(`/organizations/${org.id}/members`)
    memberCount = (members || []).length
  } catch { /* ignore */ }
  return mapOrg(org, { ...stats, memberCount })
}

export async function fetchOrganizationMembers(orgId) {
  const members = await authApi.get(`/organizations/${orgId}/members`)
  return (members || []).map(m => ({
    id: m.id,
    userId: m.user_id,
    username: m.user_id,
    role: m.role,
    joined: m.joined_at,
  }))
}

export async function fetchOrganizationTeams(orgId) {
  const teams = await authApi.get(`/organizations/${orgId}/teams`)
  return (teams || []).map(t => ({
    id: t.id,
    name: t.display_name,
    slug: t.slug,
    memberCount: 0,
    permissions: t.visibility,
    description: t.description,
  }))
}

export async function createOrganization({ slug, displayName, description }) {
  return authApi.post('/organizations', {
    slug,
    display_name: displayName,
    description,
  })
}
