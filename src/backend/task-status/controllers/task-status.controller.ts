import { NextResponse } from 'next/server'
import { inject, injectable } from 'tsyringe'
import { IsAuthenticated } from '@/backend/common/decorators'
import { ErrorHandler } from '@/backend/common/errors/error-handler'
import { validateIdParam } from '@/backend/common/validation/common.schema'
import { TaskStatusService } from '@/backend/task-status/services/task-status.service'
import {
	TaskStatusCreationSchema,
	TaskStatusUpdateSchema,
} from '@/backend/task-status/validation/task-status.schema'
import type { User } from '@/backend/users/validation/user.schema'

@injectable()
export class TaskStatusController {
	constructor(@inject(TaskStatusService) private readonly service: TaskStatusService) {}

	@IsAuthenticated()
	async create(req: Request) {
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

	@IsAuthenticated()
	async getAll() {
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

	@IsAuthenticated()
	async getById(id: string) {
		try {
			// Validate ID parameter before calling service
			const validatedId = validateIdParam(id)

			const taskStatus = await this.service.getTaskStatusById(validatedId)

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

	@IsAuthenticated()
	async update(id: string, req: Request) {
		try {
			// Validate ID parameter before calling service
			const validatedId = validateIdParam(id)

			const body = await req.json()
			const data = TaskStatusUpdateSchema.parse(body)

			const taskStatus = await this.service.updateTaskStatus(validatedId, data)

			return NextResponse.json(
				{ success: true, message: 'Task status successfully updated', data: taskStatus },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskStatusController.update')
		}
	}

	@IsAuthenticated()
	async delete(id: string) {
		try {
			// Validate ID parameter before calling service
			const validatedId = validateIdParam(id)

			await this.service.deleteTaskStatus(validatedId)

			return NextResponse.json(
				{ success: true, message: 'Task status successfully deleted' },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskStatusController.delete')
		}
	}
}
