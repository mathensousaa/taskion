import { z } from 'zod'
import type { ApiResponse } from '@/backend/common/types'
import {
	type User,
	type UserCreationInput,
	UserSchema,
	type UserUpdateInput,
} from '@/backend/users/validation/user.schema'
import { apiClient } from '@/configs/fetch-clients'
import { parseResponseData } from '@/lib/utils'

export const usersService = {
	// List users - use force-cache for semi-static data
	async list() {
		return apiClient.request<User[]>(
			'/users',
			{
				cache: 'force-cache',
			},
			z.array(UserSchema),
		)
	},

	// Get user by ID - use force-cache for individual users
	async getById(id: string) {
		return apiClient.request<User>(
			`/users/${id}`,
			{
				cache: 'force-cache',
			},
			UserSchema,
		)
	},

	// Create new user - no cache for mutable operations
	async create(data: UserCreationInput) {
		return apiClient
			.request<ApiResponse<User>>('/users', {
				method: 'POST',
				body: JSON.stringify(data),
				cache: 'no-store',
			})
			.then(parseResponseData<User>)
	},

	// Update user - no cache for mutable operations
	async update(id: string, data: UserUpdateInput) {
		return apiClient.request<User>(
			`/users/${id}`,
			{
				method: 'PUT',
				body: JSON.stringify(data),
				cache: 'no-store',
			},
			UserSchema,
		)
	},

	// Delete user - no cache for mutable operations
	async delete(id: string) {
		return apiClient.request<void>(`/users/${id}`, {
			method: 'DELETE',
			cache: 'no-store',
		})
	},
}
