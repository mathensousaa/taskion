import {
	type PaginatedTasksResponse,
	PaginatedTasksResponseSchema,
	type Task,
	type TaskCreationInput,
	TaskSchema,
	type TasksReorderInput,
	type TaskUpdateInput,
} from '@/backend/tasks/validation/task.creation.schema'
import { apiRequest, BASE_URL } from '@/lib/api-client'

export const tasksService = {
	// List tasks with pagination - use force-cache for semi-static data
	async list(limit = 20, cursor?: { order: number; created_at: string; id: string }) {
		const params = new URLSearchParams()
		params.append('limit', limit.toString())
		if (cursor) {
			params.append('cursor', JSON.stringify(cursor))
		}

		return apiRequest<PaginatedTasksResponse>(
			`${BASE_URL}/tasks?${params.toString()}`,
			{
				cache: 'force-cache',
			},
			PaginatedTasksResponseSchema,
		)
	},

	// Get task by ID - use force-cache for individual tasks
	async getById(id: string) {
		return apiRequest<Task>(
			`${BASE_URL}/tasks/${id}`,
			{
				cache: 'force-cache',
			},
			TaskSchema,
		)
	},

	// Create new task - no cache for mutable operations
	async create(data: TaskCreationInput) {
		return apiRequest<Task>(
			`${BASE_URL}/tasks`,
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
		return apiRequest<Task>(
			`${BASE_URL}/tasks/${id}`,
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
		return apiRequest<void>(`${BASE_URL}/tasks/${id}`, {
			method: 'DELETE',
			cache: 'no-store',
		})
	},

	// Reorder tasks - no cache for mutable operations
	async reorder(tasks: TasksReorderInput) {
		return apiRequest<void>(`${BASE_URL}/tasks`, {
			method: 'PATCH',
			body: JSON.stringify(tasks),
			cache: 'no-store',
		})
	},
}
