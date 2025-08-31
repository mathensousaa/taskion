import {
	type AuthResponse,
	AuthResponseSchema,
	type LoginInput,
} from '@/backend/auth/validation/auth.schema'
import { apiClient } from '@/configs/fetch-clients'

export const authService = {
	// Login user - no cache for authentication
	async login(data: LoginInput) {
		return apiClient.request<AuthResponse>(
			`/auth/login`,
			{
				method: 'POST',
				body: JSON.stringify(data),
				cache: 'no-store',
			},
			AuthResponseSchema,
		)
	},

	// Logout user - no cache for authentication
	async logout() {
		return apiClient.request<void>('/auth/logout', {
			method: 'POST',
			cache: 'no-store',
		})
	},

	// Get current user - no cache for authentication state
	async me() {
		return apiClient.request<AuthResponse>(
			`/auth/me`,
			{
				cache: 'no-store',
			},
			AuthResponseSchema,
		)
	},
}
