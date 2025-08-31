import { z } from 'zod'
import {
	type TaskStatus,
	type TaskStatusCreationInput,
	TaskStatusSchema,
	type TaskStatusUpdateInput,
} from '@/backend/task-status/validation/task-status.schema'
import { apiClient } from '@/configs/fetch-clients'

export const taskStatusService = {
	// List task statuses - use force-cache for semi-static data
	async list() {
		return apiClient.request<TaskStatus[]>(
			'/task-status',
			{
				cache: 'force-cache',
			},
			z.array(TaskStatusSchema),
		)
	},

	// Get task status by ID - use force-cache for individual statuses
	async getById(id: string) {
		return apiClient.request<TaskStatus>(
			`/task-status/${id}`,
			{
				cache: 'force-cache',
			},
			TaskStatusSchema,
		)
	},

	// Create new task status - no cache for mutable operations
	async create(data: TaskStatusCreationInput) {
		return apiClient.request<TaskStatus>(
			'/task-status',
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
		return apiClient.request<TaskStatus>(
			`/task-status/${id}`,
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
		return apiClient.request<void>(`/task-status/${id}`, {
			method: 'DELETE',
			cache: 'no-store',
		})
	},
}
