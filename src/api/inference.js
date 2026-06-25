/**
 * Inference via PlatformService.
 */
import { platformApi } from './client.js'

export async function runInference(modelSlug, { input, temperature, maxTokens, topP }) {
  return platformApi.post(`/inference/${modelSlug}`, {
    input,
    temperature,
    max_tokens: maxTokens,
    top_p: topP,
  })
}
