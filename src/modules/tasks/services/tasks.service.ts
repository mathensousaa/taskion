import {
	type PaginatedTasksResponse,
	PaginatedTasksResponseSchema,
	type Task,
	type TaskCreationInput,
	TaskSchema,
	type TasksReorderInput,
	type TaskUpdateInput,
} from '@/backend/tasks/validation/task.creation.schema'
import { apiClient } from '@/configs/fetch-clients'

export const tasksService = {
	// List tasks with pagination - use force-cache for semi-static data
	async list(limit = 20, cursor?: { order: number; created_at: string; id: string }) {
		const params = new URLSearchParams()
		params.append('limit', limit.toString())
		if (cursor) {
			params.append('cursor', JSON.stringify(cursor))
		}

		return apiClient.request<PaginatedTasksResponse>(
			`/tasks?${params.toString()}`,
			{
				cache: 'force-cache',
			},
			PaginatedTasksResponseSchema,
		)
	},

	// Get task by ID - use force-cache for individual tasks
	async getById(id: string) {
		return apiClient.request<Task>(
			`/tasks/${id}`,
			{
				cache: 'force-cache',
			},
			TaskSchema,
		)
	},

	// Create new task - no cache for mutable operations
	async create(data: TaskCreationInput) {
		return apiClient.request<Task>(
			`/tasks`,
			{
				method: 'POST',
				body: JSON.stringify(data),
				cache: 'no-store',
			},
			TaskSchema,
		)
	},

	// Update task - no cache for mutable operations
	async update(id: string, data: TaskUpdateInput) {
		return apiClient.request<Task>(
			`/tasks/${id}`,
			{
				method: 'PUT',
				body: JSON.stringify(data),
				cache: 'no-store',
			},
			TaskSchema,
		)
	},

	// Delete task - no cache for mutable operations
	async delete(id: string) {
		return apiClient.request<void>(`/tasks/${id}`, {
			method: 'DELETE',
			cache: 'no-store',
		})
	},

	// Reorder tasks - no cache for mutable operations
	async reorder(tasks: TasksReorderInput) {
		return apiClient.request<void>('/tasks', {
			method: 'PATCH',
			body: JSON.stringify(tasks),
			cache: 'no-store',
		})
	},
}
