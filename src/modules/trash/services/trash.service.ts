import type { ApiResponse } from '@/backend/common/types'
import type { Task } from '@/backend/tasks/validation/task.schema'
import { apiClient } from '@/configs/fetch-clients'

export const trashService = {
	// Get all soft-deleted tasks (trash)
	async getTrash() {
		return apiClient.request<ApiResponse<Task[]>>('/trash', {
			cache: 'no-store',
		})
	},

	// Permanently delete a specific task from trash
	async permanentlyDeleteTask(id: string) {
		return apiClient.request<void>(`/trash/${id}`, {
			method: 'DELETE',
			cache: 'no-store',
		})
	},

	// Empty trash (permanently delete all soft-deleted tasks)
	async emptyTrash() {
		return apiClient.request<void>('/trash', {
			method: 'DELETE',
			cache: 'no-store',
		})
	},
}
