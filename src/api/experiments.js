const mockExperiments = [
  {
    id: 'exp-001',
    name: 'resnet50-lr-sweep',
    owner: 'TomiTsuma',
    project: 'image-classification-v2',
    status: 'completed',
    metrics: { accuracy: 0.9231, loss: 0.2104, f1: 0.9188 },
    params: { lr: 0.001, epochs: 50, batchSize: 64 },
    createdAt: '2026-06-20T10:00:00Z',
    duration: '2h 14m',
  },
  {
    id: 'exp-002',
    name: 'bert-fine-tune-sentiment',
    owner: 'aether-ai',
    project: 'sentiment-analysis',
    status: 'running',
    metrics: { accuracy: 0.8840, loss: 0.3312, f1: 0.8790 },
    params: { lr: 0.00002, epochs: 5, batchSize: 32 },
    createdAt: '2026-06-24T08:30:00Z',
    duration: '45m (ongoing)',
  },
  {
    id: 'exp-003',
    name: 'gpt2-text-gen-warmup',
    owner: 'TomiTsuma',
    project: 'text-generation',
    status: 'failed',
    metrics: { accuracy: null, loss: null, f1: null },
    params: { lr: 0.0005, epochs: 10, batchSize: 16 },
    createdAt: '2026-06-18T14:00:00Z',
    duration: '8m (failed)',
  },
  {
    id: 'exp-004',
    name: 'vit-imagenet-baseline',
    owner: 'data-team',
    project: 'vision-transformer',
    status: 'completed',
    metrics: { accuracy: 0.9512, loss: 0.1688, f1: 0.9498 },
    params: { lr: 0.0003, epochs: 100, batchSize: 128 },
    createdAt: '2026-05-30T09:00:00Z',
    duration: '11h 42m',
  },
  {
    id: 'exp-005',
    name: 'whisper-finetune-swahili',
    owner: 'TomiTsuma',
    project: 'multilingual-asr',
    status: 'completed',
    metrics: { accuracy: 0.8765, loss: 0.2941, f1: 0.8710 },
    params: { lr: 0.00005, epochs: 20, batchSize: 8 },
    createdAt: '2026-06-12T11:00:00Z',
    duration: '6h 03m',
  },
  {
    id: 'exp-006',
    name: 'stable-diffusion-lora-v1',
    owner: 'aether-ai',
    project: 'image-generation',
    status: 'running',
    metrics: { accuracy: null, loss: 0.4201, f1: null },
    params: { lr: 0.0001, epochs: 30, batchSize: 4 },
    createdAt: '2026-06-25T00:00:00Z',
    duration: '3h 20m (ongoing)',
  },
]

export function fetchAllExperiments() {
  return Promise.resolve([...mockExperiments])
}

export function fetchExperiment(id) {
  const experiment = mockExperiments.find(e => e.id === id)
  if (!experiment) return Promise.reject(new Error(`Experiment not found: ${id}`))
  return Promise.resolve({ ...experiment })
}
