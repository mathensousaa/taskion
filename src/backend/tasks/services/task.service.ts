import { inject, injectable } from 'tsyringe'
import { UnauthorizedError } from '@/backend/common/errors/unauthorized-error'
import { TaskStatusService } from '@/backend/task-status/services/task-status.service'
import type { ITaskRepository } from '@/backend/tasks/repository/task.repository'
import {
	type PaginatedTasksResponse,
	type PaginationQuery,
	type TaskCreationInput,
	TaskDbInsertSchema,
	type TasksReorderInput,
	type TaskUpdateInput,
} from '@/backend/tasks/validation/task.creation.schema'
import type { User } from '@/backend/users/validation/user.schema'

@injectable()
export class TaskService {
	constructor(
		@inject(TaskStatusService) private readonly taskStatusService: TaskStatusService,
		@inject('ITaskRepository') private readonly taskRepository: ITaskRepository,
	) {}

	async createTask(input: TaskCreationInput, authenticatedUser: User) {
		// Ensure the task is created for the authenticated user
		const taskData = { ...input, user_id: authenticatedUser.id }

		const statusId = input.status_id ?? (await this.taskStatusService.getDefaultStatusId())

		// Get the next available order for this user
		const maxOrder = await this.taskRepository.getMaxOrderByUserId(authenticatedUser.id)
		const nextOrder = maxOrder + 1

		const dbInput = TaskDbInsertSchema.parse({
			...taskData,
			status_id: statusId,
			description: input.description ?? null,
			order: nextOrder, // Use the next available order
		})
		const task = await this.taskRepository.create(dbInput)

		return task
	}

	async getAllTasks(authenticatedUser: User) {
		// Only return tasks belonging to the authenticated user, ordered by order field
		return await this.taskRepository.findAllByUserId(authenticatedUser.id)
	}

	async getTasksPaginated(
		authenticatedUser: User,
		pagination: PaginationQuery,
	): Promise<PaginatedTasksResponse> {
		// Only return tasks belonging to the authenticated user with pagination
		return await this.taskRepository.findAllByUserIdPaginated(authenticatedUser.id, pagination)
	}

	async getTaskById(id: string, authenticatedUser: User) {
		const task = await this.taskRepository.findById(id)

		if (!task) {
			return null
		}

		// Verify the task belongs to the authenticated user
		if (task.user_id !== authenticatedUser.id) {
			throw new UnauthorizedError('Access denied: Task does not belong to authenticated user')
		}

		return task
	}

	async updateTask(id: string, input: TaskUpdateInput, authenticatedUser: User) {
		// First verify the task exists and belongs to the authenticated user
		const existingTask = await this.taskRepository.findById(id)

		if (!existingTask) {
			throw new UnauthorizedError('Task not found')
		}

		if (existingTask.user_id !== authenticatedUser.id) {
			throw new UnauthorizedError('Access denied: Task does not belong to authenticated user')
		}

		// Update the task with the provided data
		return await this.taskRepository.update(id, input)
	}

	async deleteTask(id: string, authenticatedUser: User) {
		// First verify the task exists and belongs to the authenticated user
		const existingTask = await this.taskRepository.findById(id)

		if (!existingTask) {
			throw new UnauthorizedError('Task not found')
		}

		if (existingTask.user_id !== authenticatedUser.id) {
			throw new UnauthorizedError('Access denied: Task does not belong to authenticated user')
		}

		await this.taskRepository.delete(id)
	}

	async reorderTasks(authenticatedUser: User, reorderData: TasksReorderInput) {
		// Verify all tasks belong to the authenticated user
		const taskIds = reorderData.map((item) => item.taskId)
		const tasks = await Promise.all(taskIds.map((id) => this.taskRepository.findById(id)))

		// Check if all tasks exist and belong to the user
		for (let i = 0; i < tasks.length; i++) {
			const task = tasks[i]
			if (!task) {
				throw new UnauthorizedError(`Task with id ${taskIds[i]} not found`)
			}
			if (task.user_id !== authenticatedUser.id) {
				throw new UnauthorizedError(
					`Access denied: Task ${taskIds[i]} does not belong to authenticated user`,
				)
			}
		}

		// Perform the reordering
		return await this.taskRepository.reorderTasks(authenticatedUser.id, reorderData)
	}
}
