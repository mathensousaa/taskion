import { API_URL, N8N_BASE_URL } from '@/configs/environment'
import { FetchClient } from '@/lib/fetch-client'

export const apiClient = new FetchClient(API_URL!)
export const n8nClient = new FetchClient(N8N_BASE_URL!)
