const mockOrganizations = [
  {
    id: 'org-001',
    slug: 'aether-ai',
    name: 'Aether AI',
    description: 'Official Aether organization hosting platform models, datasets, and spaces.',
    memberCount: 24,
    modelCount: 48,
    datasetCount: 31,
    plan: 'enterprise',
    createdAt: '2025-06-01T00:00:00Z',
    avatar: null,
  },
  {
    id: 'org-002',
    slug: 'data-team',
    name: 'Data Team',
    description: 'Collaborative workspace for data engineering and dataset curation efforts.',
    memberCount: 8,
    modelCount: 12,
    datasetCount: 56,
    plan: 'pro',
    createdAt: '2025-09-15T10:00:00Z',
    avatar: null,
  },
  {
    id: 'org-003',
    slug: 'research-lab',
    name: 'Research Lab',
    description: 'Academic research group focused on multimodal learning and model interpretability.',
    memberCount: 15,
    modelCount: 27,
    datasetCount: 18,
    plan: 'pro',
    createdAt: '2025-11-20T14:00:00Z',
    avatar: null,
  },
  {
    id: 'org-004',
    slug: 'community-models',
    name: 'Community Models',
    description: 'Open-source community organization for sharing and improving models collaboratively.',
    memberCount: 203,
    modelCount: 145,
    datasetCount: 87,
    plan: 'free',
    createdAt: '2025-07-04T00:00:00Z',
    avatar: null,
  },
]

export function fetchAllOrganizations() {
  return Promise.resolve([...mockOrganizations])
}

export function fetchOrganization(slug) {
  const org = mockOrganizations.find(o => o.slug === slug)
  if (!org) return Promise.reject(new Error(`Organization not found: ${slug}`))
  return Promise.resolve({ ...org })
}
