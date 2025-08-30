import { NextResponse } from 'next/server'
import { inject, injectable } from 'tsyringe'
import { AuthenticatedUser } from '@/backend/common/decorators'
import { ErrorHandler } from '@/backend/common/errors/error-handler'
import { TaskStatusService } from '@/backend/task-status/services/task-status.service'
import {
	TaskStatusCreationSchema,
	TaskStatusUpdateSchema,
} from '@/backend/task-status/validation/task-status.schema'
import type { User } from '@/backend/users/validation/user.schema'

@injectable()
export class TaskStatusController {
	constructor(@inject(TaskStatusService) private readonly service: TaskStatusService) {}

	@AuthenticatedUser()
	async create(authenticatedUser: User, req: Request) {
		try {
			const body = await req.json()
			const data = TaskStatusCreationSchema.parse(body)

			const taskStatus = await this.service.createTaskStatus(data)

			return NextResponse.json(
				{ success: true, message: 'Task status successfully created', data: taskStatus },
				{ status: 201 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskStatusController.create')
		}
	}

	@AuthenticatedUser()
	async getAll(authenticatedUser: User) {
		try {
			const taskStatuses = await this.service.getAllTaskStatuses()

			return NextResponse.json(
				{ success: true, message: 'Task statuses retrieved successfully', data: taskStatuses },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskStatusController.getAll')
		}
	}

	@AuthenticatedUser()
	async getById(authenticatedUser: User, id: string) {
		try {
			const taskStatus = await this.service.getTaskStatusById(id)

			if (!taskStatus) {
				return NextResponse.json(
					{ success: false, message: 'Task status not found' },
					{ status: 404 },
				)
			}

			return NextResponse.json(
				{ success: true, message: 'Task status retrieved successfully', data: taskStatus },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskStatusController.getById')
		}
	}

	@AuthenticatedUser()
	async update(authenticatedUser: User, id: string, req: Request) {
		try {
			const body = await req.json()
			const data = TaskStatusUpdateSchema.parse(body)

			const taskStatus = await this.service.updateTaskStatus(id, data)

			return NextResponse.json(
				{ success: true, message: 'Task status successfully updated', data: taskStatus },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskStatusController.update')
		}
	}

	@AuthenticatedUser()
	async delete(authenticatedUser: User, id: string) {
		try {
			await this.service.deleteTaskStatus(id)

			return NextResponse.json(
				{ success: true, message: 'Task status successfully deleted' },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskStatusController.delete')
		}
	}
}
