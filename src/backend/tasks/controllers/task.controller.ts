import { NextResponse } from 'next/server'
import { inject, injectable } from 'tsyringe'
import { AuthenticatedUser } from '@/backend/common/decorators'
import { ErrorHandler } from '@/backend/common/errors/error-handler'
import { TaskService } from '@/backend/tasks/services/task.service'
import {
	PaginationQuerySchema,
	TaskCreationSchema,
	TasksReorderSchema,
	TaskUpdateSchema,
} from '@/backend/tasks/validation/task.creation.schema'
import type { User } from '@/backend/users/validation/user.schema'

@injectable()
export class TaskController {
	constructor(@inject(TaskService) private readonly service: TaskService) {}

	@AuthenticatedUser()
	async create(authenticatedUser: User, req: Request) {
		try {
			const body = await req.json()
			const data = TaskCreationSchema.parse(body)

			const task = await this.service.createTask(data, authenticatedUser)

			return NextResponse.json(
				{ success: true, message: 'Task successfully created', data: task },
				{ status: 201 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskController.create')
		}
	}

	@AuthenticatedUser()
	async getAll(authenticatedUser: User, req: Request) {
		try {
			// Parse query parameters for pagination
			const url = new URL(req.url)
			const pagination = PaginationQuerySchema.parse({
				limit: url.searchParams.get('limit'),
				cursor: url.searchParams.get('cursor')
					? JSON.parse(url.searchParams.get('cursor')!)
					: undefined,
			})

			const result = await this.service.getTasksPaginated(authenticatedUser, pagination)

			return NextResponse.json(
				{
					success: true,
					message: 'Tasks retrieved successfully',
					...result,
				},
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskController.getAll')
		}
	}

	@AuthenticatedUser()
	async getById(authenticatedUser: User, id: string) {
		try {
			const task = await this.service.getTaskById(id, authenticatedUser)

			if (!task) {
				return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 })
			}

			return NextResponse.json(
				{ success: true, message: 'Task retrieved successfully', data: task },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskController.getById')
		}
	}

	@AuthenticatedUser()
	async update(authenticatedUser: User, id: string, req: Request) {
		try {
			const body = await req.json()
			const data = TaskUpdateSchema.parse(body)

			const task = await this.service.updateTask(id, data, authenticatedUser)

			return NextResponse.json(
				{ success: true, message: 'Task successfully updated', data: task },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskController.update')
		}
	}

	@AuthenticatedUser()
	async delete(authenticatedUser: User, id: string) {
		try {
			await this.service.deleteTask(id, authenticatedUser)

			return NextResponse.json(
				{ success: true, message: 'Task successfully deleted' },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskController.delete')
		}
	}

	@AuthenticatedUser()
	async reorder(authenticatedUser: User, req: Request) {
		try {
			const body = await req.json()
			const data = TasksReorderSchema.parse(body)

			const tasks = await this.service.reorderTasks(authenticatedUser, data)

			return NextResponse.json(
				{
					success: true,
					message: 'Tasks successfully reordered',
					data: tasks,
				},
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskController.reorder')
		}
	}
}
