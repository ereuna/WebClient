const mockNotifications = [
  {
    id: 'notif-001',
    type: 'pipeline_completed',
    title: 'Pipeline run completed',
    body: 'image-classification-training finished successfully with 142 steps.',
    read: false,
    createdAt: '2026-06-24T02:14:00Z',
    link: '/pipelines/pipe-001',
  },
  {
    id: 'notif-002',
    type: 'experiment_failed',
    title: 'Experiment failed',
    body: 'gpt2-text-gen-warmup encountered an OOM error and was stopped.',
    read: false,
    createdAt: '2026-06-18T14:08:00Z',
    link: '/experiments/exp-003',
  },
  {
    id: 'notif-003',
    type: 'model_starred',
    title: 'New star on your model',
    body: 'aether-ai starred your model whisper-swahili.',
    read: true,
    createdAt: '2026-06-17T09:22:00Z',
    link: '/TomiTsuma/whisper-swahili',
  },
  {
    id: 'notif-004',
    type: 'deployment_error',
    title: 'Deployment error',
    body: 'text-gen-demo entered an error state. Check replica logs for details.',
    read: false,
    createdAt: '2026-06-16T18:45:00Z',
    link: '/deployments/dep-004',
  },
  {
    id: 'notif-005',
    type: 'org_invite',
    title: 'Organization invitation',
    body: 'You have been invited to join the Research Lab organization.',
    read: true,
    createdAt: '2026-06-10T11:00:00Z',
    link: '/organizations/research-lab',
  },
  {
    id: 'notif-006',
    type: 'dataset_comment',
    title: 'New comment on your dataset',
    body: 'data-team commented on swahili-speech-corpus: "Great dataset, adding to our pipeline."',
    read: true,
    createdAt: '2026-06-05T14:30:00Z',
    link: '/datasets/swahili-speech-corpus',
  },
]

export function fetchNotifications() {
  return Promise.resolve([...mockNotifications])
}
