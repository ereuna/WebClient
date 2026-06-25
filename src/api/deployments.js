const mockDeployments = [
  {
    id: 'dep-001',
    name: 'sentiment-api-prod',
    model: 'bert-sentiment-v2',
    version: 'v2.1.0',
    status: 'running',
    replicas: 3,
    latencyMs: 42,
    requestsPerSec: 180,
    gpuUsage: 0.61,
    cost: 1.20,
    region: 'us-east-1',
    createdAt: '2026-04-10T12:00:00Z',
  },
  {
    id: 'dep-002',
    name: 'image-classifier-staging',
    model: 'resnet50-v1',
    version: 'v1.4.2',
    status: 'running',
    replicas: 1,
    latencyMs: 95,
    requestsPerSec: 24,
    gpuUsage: 0.33,
    cost: 0.48,
    region: 'eu-west-1',
    createdAt: '2026-05-01T08:30:00Z',
  },
  {
    id: 'dep-003',
    name: 'whisper-transcription-api',
    model: 'whisper-swahili',
    version: 'v1.0.0',
    status: 'stopped',
    replicas: 0,
    latencyMs: null,
    requestsPerSec: 0,
    gpuUsage: 0,
    cost: 0,
    region: 'us-west-2',
    createdAt: '2026-03-15T15:00:00Z',
  },
  {
    id: 'dep-004',
    name: 'text-gen-demo',
    model: 'gpt2-finetuned',
    version: 'v0.9.1',
    status: 'error',
    replicas: 2,
    latencyMs: null,
    requestsPerSec: 0,
    gpuUsage: 0,
    cost: 0.96,
    region: 'ap-southeast-1',
    createdAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'dep-005',
    name: 'vit-inference-prod',
    model: 'vit-imagenet',
    version: 'v3.0.0',
    status: 'running',
    replicas: 4,
    latencyMs: 28,
    requestsPerSec: 340,
    gpuUsage: 0.78,
    cost: 2.88,
    region: 'us-east-1',
    createdAt: '2026-06-10T07:00:00Z',
  },
]

export function fetchAllDeployments() {
  return Promise.resolve([...mockDeployments])
}

export function fetchDeployment(id) {
  const deployment = mockDeployments.find(d => d.id === id)
  if (!deployment) return Promise.reject(new Error(`Deployment not found: ${id}`))
  return Promise.resolve({ ...deployment })
}
