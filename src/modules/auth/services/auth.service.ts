import {
	type AuthResponse,
	AuthResponseSchema,
	type LoginInput,
} from '@/backend/auth/validation/auth.schema'
import { apiRequest, BASE_URL } from '@/lib/api-client'

export const authService = {
	// Login user - no cache for authentication
	async login(data: LoginInput) {
		return apiRequest<AuthResponse>(
			`${BASE_URL}/auth/login`,
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
		return apiRequest<void>(`${BASE_URL}/auth/logout`, {
			method: 'POST',
			cache: 'no-store',
		})
	},

	// Get current user - no cache for authentication state
	async me() {
		return apiRequest<AuthResponse>(
			`${BASE_URL}/auth/me`,
			{
				cache: 'no-store',
			},
			AuthResponseSchema,
		)
	},
}
