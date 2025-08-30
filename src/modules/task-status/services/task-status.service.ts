import { z } from 'zod'
import {
	type TaskStatus,
	type TaskStatusCreationInput,
	TaskStatusSchema,
	type TaskStatusUpdateInput,
} from '@/backend/task-status/validation/task-status.schema'
import { apiRequest, BASE_URL } from '@/lib/api-client'

export const taskStatusService = {
	// List task statuses - use force-cache for semi-static data
	async list() {
		return apiRequest<TaskStatus[]>(
			`${BASE_URL}/task-status`,
			{
				cache: 'force-cache',
			},
			z.array(TaskStatusSchema),
		)
	},

	// Get task status by ID - use force-cache for individual statuses
	async getById(id: string) {
		return apiRequest<TaskStatus>(
			`${BASE_URL}/task-status/${id}`,
			{
				cache: 'force-cache',
			},
			TaskStatusSchema,
		)
	},

	// Create new task status - no cache for mutable operations
	async create(data: TaskStatusCreationInput) {
		return apiRequest<TaskStatus>(
			`${BASE_URL}/task-status`,
			{
				method: 'POST',
				body: JSON.stringify(data),
				cache: 'no-store',
			},
			TaskStatusSchema,
		)
	},

	// Update task status - no cache for mutable operations
	async update(id: string, data: TaskStatusUpdateInput) {
		return apiRequest<TaskStatus>(
			`${BASE_URL}/task-status/${id}`,
			{
				method: 'PUT',
				body: JSON.stringify(data),
				cache: 'no-store',
			},
			TaskStatusSchema,
		)
	},

	// Delete task status - no cache for mutable operations
	async delete(id: string) {
		return apiRequest<void>(`${BASE_URL}/task-status/${id}`, {
			method: 'DELETE',
			cache: 'no-store',
		})
	},
}
