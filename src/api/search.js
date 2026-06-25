const mockResults = {
  models: [
    { id: 'model-001', name: 'bert-sentiment-v2', owner: 'aether-ai', type: 'model', description: 'Fine-tuned BERT for sentiment analysis.' },
    { id: 'model-002', name: 'vit-imagenet', owner: 'data-team', type: 'model', description: 'Vision Transformer trained on ImageNet.' },
  ],
  datasets: [
    { id: 'ds-001', name: 'multilingual-sentiment-corpus', owner: 'aether-ai', type: 'dataset', description: 'Multilingual sentiment labels across 12 languages.' },
  ],
  repositories: [
    { id: 'repo-001', name: 'aether-trainer', owner: 'TomiTsuma', type: 'repository', description: 'Lightweight training loop library.' },
  ],
  pipelines: [
    { id: 'pipe-001', name: 'image-classification-training', owner: 'aether-ai', type: 'pipeline', description: 'End-to-end training pipeline.' },
  ],
  experiments: [
    { id: 'exp-001', name: 'resnet50-lr-sweep', owner: 'TomiTsuma', type: 'experiment', description: 'Learning rate sweep for ResNet-50.' },
  ],
  spaces: [
    { id: 'app-001', name: 'sentiment-demo', owner: 'aether-ai', type: 'space', description: 'Interactive sentiment analysis demo.' },
  ],
  organizations: [
    { id: 'org-001', slug: 'aether-ai', name: 'Aether AI', type: 'organization', description: 'Official Aether organization.' },
  ],
  users: [
    { username: 'TomiTsuma', fullName: 'Tomi Tsuma', type: 'user', bio: 'ML engineer and open-source contributor.' },
  ],
}

export function searchAll(query) {
  if (!query || !query.trim()) {
    return Promise.resolve({
      models: [],
      datasets: [],
      repositories: [],
      pipelines: [],
      experiments: [],
      spaces: [],
      organizations: [],
      users: [],
    })
  }

  const q = query.toLowerCase()
  const filter = arr => arr.filter(item =>
    (item.name || item.username || '').toLowerCase().includes(q) ||
    (item.description || item.bio || '').toLowerCase().includes(q)
  )

  return Promise.resolve({
    models: filter(mockResults.models),
    datasets: filter(mockResults.datasets),
    repositories: filter(mockResults.repositories),
    pipelines: filter(mockResults.pipelines),
    experiments: filter(mockResults.experiments),
    spaces: filter(mockResults.spaces),
    organizations: filter(mockResults.organizations),
    users: filter(mockResults.users),
  })
}
