import { z } from 'zod'
import {
	type User,
	type UserCreationInput,
	UserSchema,
	type UserUpdateInput,
} from '@/backend/users/validation/user.schema'
import { apiRequest, BASE_URL } from '@/lib/api-client'

export const usersService = {
	// List users - use force-cache for semi-static data
	async list() {
		return apiRequest<User[]>(
			`${BASE_URL}/users`,
			{
				cache: 'force-cache',
			},
			z.array(UserSchema),
		)
	},

	// Get user by ID - use force-cache for individual users
	async getById(id: string) {
		return apiRequest<User>(
			`${BASE_URL}/users/${id}`,
			{
				cache: 'force-cache',
			},
			UserSchema,
		)
	},

	// Create new user - no cache for mutable operations
	async create(data: UserCreationInput) {
		return apiRequest<User>(
			`${BASE_URL}/users`,
			{
				method: 'POST',
				body: JSON.stringify(data),
				cache: 'no-store',
			},
			UserSchema,
		)
	},

	// Update user - no cache for mutable operations
	async update(id: string, data: UserUpdateInput) {
		return apiRequest<User>(
			`${BASE_URL}/users/${id}`,
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
		return apiRequest<void>(`${BASE_URL}/users/${id}`, {
			method: 'DELETE',
			cache: 'no-store',
		})
	},
}
