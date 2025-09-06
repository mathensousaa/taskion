import { inject, injectable } from 'tsyringe'
import { NotFoundError } from '@/backend/common/errors/not-found-error'
import { UnauthorizedError } from '@/backend/common/errors/unauthorized-error'
import type { Paginated } from '@/backend/common/types'
import type {
	PaginationQuery,
	TaskFilters,
	TaskRepositoryFilters,
} from '@/backend/common/validation/common.schema'
import { TaskEnhancerService } from '@/backend/task-enhancer/services/task-enhancer.service'
import { TaskStatusService } from '@/backend/task-status/services/task-status.service'
import type { ITaskRepository } from '@/backend/tasks/repository/task.repository'
import {
	type Task,
	type TaskCreationInput,
	TaskDbInsertSchema,
	type TasksReorderInput,
	type TaskUpdateInput,
} from '@/backend/tasks/validation/task.schema'
import type { User } from '@/backend/users/validation/user.schema'

@injectable()
export class TaskService {
	constructor(
		@inject(TaskStatusService) private readonly taskStatusService: TaskStatusService,
		@inject('ITaskRepository') private readonly taskRepository: ITaskRepository,
		@inject(TaskEnhancerService) private readonly taskEnhancerService: TaskEnhancerService,
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

		try {
			const enhancedTask = await this.taskEnhancerService.enhanceTask(task)
			return enhancedTask
		} catch (error) {
			// Log the error but return the original task
			console.warn('Task enhancement failed during creation, returning original task:', error)
			return task
		}
	}

	async getAllTasks(authenticatedUser: User) {
		// Only return tasks belonging to the authenticated user, ordered by order field
		return await this.taskRepository.findAllByUserId(authenticatedUser.id)
	}

	async getTasksPaginated(
		authenticatedUser: User,
		pagination: PaginationQuery,
	): Promise<Paginated<Task>> {
		// Only return tasks belonging to the authenticated user with pagination
		return await this.taskRepository.findAllByUserIdPaginated(authenticatedUser.id, pagination)
	}

	async getTasksWithFilters(authenticatedUser: User, filters: TaskFilters): Promise<Task[]> {
		// Convert status slug to status_id if provided
		let convertedFilters: TaskRepositoryFilters = {}
		if (filters.status) {
			const taskStatus = await this.taskStatusService.getTaskStatusBySlug(filters.status)
			if (!taskStatus) {
				throw new NotFoundError(`Task status with slug '${filters.status}' not found`)
			}
			convertedFilters = { status_id: taskStatus.id }
		}

		// Only return tasks belonging to the authenticated user with filters
		return await this.taskRepository.findAllByUserIdWithFilters(
			authenticatedUser.id,
			convertedFilters,
		)
	}

	async getTasksPaginatedWithFilters(
		authenticatedUser: User,
		pagination: PaginationQuery,
		filters: TaskFilters,
	): Promise<Paginated<Task>> {
		// Convert status slug to status_id if provided
		let convertedFilters: TaskRepositoryFilters = {}
		if (filters.status) {
			const taskStatus = await this.taskStatusService.getTaskStatusBySlug(filters.status)
			if (!taskStatus) {
				throw new NotFoundError(`Task status with slug '${filters.status}' not found`)
			}
			convertedFilters = { status_id: taskStatus.id }
		}

		// Only return tasks belonging to the authenticated user with pagination and filters
		return await this.taskRepository.findAllByUserIdPaginatedWithFilters(
			authenticatedUser.id,
			pagination,
			convertedFilters,
		)
	}

	async getTaskById(id: string, authenticatedUser: User) {
		const task = await this.taskRepository.findById(id)

		if (!task) {
			return null
		}

		// Verify the task belongs to the authenticated user
		if (task.user_id !== authenticatedUser.id) {
			throw new NotFoundError('Task not found')
		}

		return task
	}

	async updateTask(id: string, input: TaskUpdateInput, authenticatedUser: User) {
		const existingTask = await this.taskRepository.findById(id)

		if (!existingTask) {
			throw new NotFoundError('Task not found')
		}

		if (existingTask.user_id !== authenticatedUser.id) {
			throw new NotFoundError('Task not found')
		}

		const updatedTask = await this.taskRepository.update(id, input)

		return updatedTask
	}

	async deleteTask(id: string, authenticatedUser: User) {
		// First verify the task exists and belongs to the authenticated user
		const existingTask = await this.taskRepository.findById(id)

		if (!existingTask) {
			throw new NotFoundError('Task not found')
		}

		if (existingTask.user_id !== authenticatedUser.id) {
			throw new NotFoundError('Task not found')
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

	async getTrash(authenticatedUser: User) {
		// Get all soft-deleted tasks belonging to the authenticated user
		return await this.taskRepository.findTrashByUserId(authenticatedUser.id)
	}

	async permanentlyDeleteTask(id: string, authenticatedUser: User) {
		// First verify the task exists, is soft-deleted, and belongs to the authenticated user
		const existingTask = await this.taskRepository.findByIdIncludingDeleted(id)

		if (!existingTask) {
			throw new NotFoundError('Task not found')
		}

		if (existingTask.user_id !== authenticatedUser.id) {
			throw new NotFoundError('Task not found')
		}

		if (!existingTask.deleted_at) {
			throw new NotFoundError('Task is not in trash')
		}

		// Permanently delete the task
		await this.taskRepository.permanentlyDelete(id)
	}

	async emptyTrash(authenticatedUser: User) {
		// Permanently delete all soft-deleted tasks belonging to the authenticated user
		await this.taskRepository.permanentlyDeleteAllByUserId(authenticatedUser.id)
	}

	async restoreTask(id: string, authenticatedUser: User) {
		// First verify the task exists, is soft-deleted, and belongs to the authenticated user
		const existingTask = await this.taskRepository.findByIdIncludingDeleted(id)

		if (!existingTask) {
			throw new NotFoundError('Task not found')
		}

		if (existingTask.user_id !== authenticatedUser.id) {
			throw new NotFoundError('Task not found')
		}

		if (!existingTask.deleted_at) {
			throw new NotFoundError('Task is not in trash')
		}

		// Restore the task by setting deleted_at to null
		return await this.taskRepository.restore(id)
	}

	async toggleTaskStatus(id: string, authenticatedUser: User) {
		// First verify the task exists and belongs to the authenticated user
		const existingTask = await this.taskRepository.findById(id)

		if (!existingTask) {
			throw new NotFoundError('Task not found')
		}

		if (existingTask.user_id !== authenticatedUser.id) {
			throw new NotFoundError('Not found')
		}

		// Get the current task status
		const currentStatus = await this.taskStatusService.getTaskStatusById(existingTask.status_id)
		if (!currentStatus) {
			throw new NotFoundError('Current task status not found')
		}

		// Determine the new status based on current status slug
		let newStatusSlug: string
		if (currentStatus.slug === 'not_started' || currentStatus.slug === 'in_progress') {
			newStatusSlug = 'done'
		} else if (currentStatus.slug === 'done') {
			newStatusSlug = 'not_started'
		} else {
			// If the task is in any other status, default to 'done'
			newStatusSlug = 'done'
		}

		// Get the new status
		const newStatus = await this.taskStatusService.getTaskStatusBySlug(newStatusSlug)
		if (!newStatus) {
			throw new NotFoundError(`Task status with slug '${newStatusSlug}' not found`)
		}

		// Update the task with the new status
		return await this.taskRepository.update(id, { status_id: newStatus.id })
	}

	async updateTaskStatusBySlug(id: string, statusSlug: string, authenticatedUser: User) {
		// First verify the task exists and belongs to the authenticated user
		const existingTask = await this.taskRepository.findById(id)

		if (!existingTask) {
			throw new NotFoundError('Task not found')
		}

		if (existingTask.user_id !== authenticatedUser.id) {
			throw new NotFoundError('Not found')
		}

		// Get the task status by slug
		const taskStatus = await this.taskStatusService.getTaskStatusBySlug(statusSlug)
		if (!taskStatus) {
			throw new NotFoundError(`Task status with slug '${statusSlug}' not found`)
		}

		// Update the task with the new status
		return await this.taskRepository.update(id, { status_id: taskStatus.id })
	}
}
