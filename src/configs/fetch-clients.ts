import { API_URL, N8N_BASE_URL } from '@/configs/environment'
import { FetchClient } from '@/lib/fetch-client'

console.log('API_URL', API_URL)
console.log('N8N_BASE_URL', N8N_BASE_URL)

export const apiClient = new FetchClient(API_URL ?? 'http://localhost:3000/api')
export const n8nClient = new FetchClient(N8N_BASE_URL!)
