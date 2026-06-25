const mockPipelines = [
  {
    id: 'pipe-001',
    name: 'image-classification-training',
    owner: 'aether-ai',
    description: 'End-to-end pipeline for training image classification models on custom datasets.',
    status: 'active',
    schedule: '0 2 * * *',
    lastRun: '2026-06-24T02:00:00Z',
    runs: 142,
    tags: ['vision', 'classification', 'automated'],
    createdAt: '2025-11-10T09:00:00Z',
  },
  {
    id: 'pipe-002',
    name: 'nlp-fine-tuning-pipeline',
    owner: 'TomiTsuma',
    description: 'Automated fine-tuning pipeline for language models with hyperparameter sweep.',
    status: 'active',
    schedule: '0 6 * * 1',
    lastRun: '2026-06-23T06:00:00Z',
    runs: 38,
    tags: ['nlp', 'fine-tuning', 'llm'],
    createdAt: '2026-01-05T12:00:00Z',
  },
  {
    id: 'pipe-003',
    name: 'dataset-preprocessing',
    owner: 'data-team',
    description: 'Preprocessing and validation pipeline for raw ingested datasets before training.',
    status: 'paused',
    schedule: null,
    lastRun: '2026-06-10T14:30:00Z',
    runs: 77,
    tags: ['data', 'preprocessing', 'etl'],
    createdAt: '2025-09-20T08:00:00Z',
  },
  {
    id: 'pipe-004',
    name: 'model-evaluation-suite',
    owner: 'aether-ai',
    description: 'Runs evaluation benchmarks across all registered model versions nightly.',
    status: 'active',
    schedule: '0 3 * * *',
    lastRun: '2026-06-24T03:00:00Z',
    runs: 210,
    tags: ['evaluation', 'benchmarks', 'automated'],
    createdAt: '2025-08-01T10:00:00Z',
  },
  {
    id: 'pipe-005',
    name: 'speech-transcription-batch',
    owner: 'TomiTsuma',
    description: 'Batch transcription pipeline using Whisper for audio dataset generation.',
    status: 'draft',
    schedule: null,
    lastRun: null,
    runs: 0,
    tags: ['audio', 'speech', 'whisper'],
    createdAt: '2026-06-20T16:00:00Z',
  },
]

export function fetchAllPipelines() {
  return Promise.resolve([...mockPipelines])
}

export function fetchPipeline(id) {
  const pipeline = mockPipelines.find(p => p.id === id)
  if (!pipeline) return Promise.reject(new Error(`Pipeline not found: ${id}`))
  return Promise.resolve({ ...pipeline })
}
