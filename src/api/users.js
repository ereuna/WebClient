const mockUsers = [
  {
    username: 'TomiTsuma',
    fullName: 'Tomi Tsuma',
    bio: 'ML engineer building open-source tools for the Aether platform. Focused on NLP and multilingual models.',
    location: 'Nairobi, Kenya',
    joinedAt: '2025-06-15T00:00:00Z',
    followers: 142,
    following: 58,
    models: [
      { id: 'model-010', name: 'whisper-swahili', description: 'Whisper fine-tuned on Swahili audio data.' },
      { id: 'model-011', name: 'bert-multilingual-ner', description: 'Named entity recognition for African languages.' },
    ],
    datasets: [
      { id: 'ds-010', name: 'swahili-speech-corpus', description: '50h of labeled Swahili speech recordings.' },
    ],
    repositories: [
      { id: 'repo-010', name: 'aether-trainer', description: 'Lightweight training loop library for Aether.' },
    ],
  },
  {
    username: 'aether-ai',
    fullName: 'Aether AI',
    bio: 'Official Aether AI organization account. Maintains platform models and example projects.',
    location: 'San Francisco, CA',
    joinedAt: '2025-06-01T00:00:00Z',
    followers: 3410,
    following: 12,
    models: [
      { id: 'model-001', name: 'bert-sentiment-v2', description: 'Fine-tuned BERT for sentiment analysis.' },
      { id: 'model-002', name: 'vit-imagenet', description: 'Vision Transformer trained on ImageNet.' },
    ],
    datasets: [
      { id: 'ds-001', name: 'multilingual-sentiment-corpus', description: 'Multilingual sentiment labels across 12 languages.' },
    ],
    repositories: [],
  },
]

export function fetchUser(username) {
  const user = mockUsers.find(u => u.username === username)
  if (!user) {
    return Promise.resolve({
      username,
      fullName: username,
      bio: '',
      location: '',
      joinedAt: new Date().toISOString(),
      followers: 0,
      following: 0,
      models: [],
      datasets: [],
      repositories: [],
    })
  }
  return Promise.resolve({ ...user })
}
