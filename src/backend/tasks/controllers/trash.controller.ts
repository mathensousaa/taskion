import { NextResponse } from 'next/server'
import { inject, injectable } from 'tsyringe'
import { IsAuthenticated } from '@/backend/common/decorators'
import { ErrorHandler } from '@/backend/common/errors/error-handler'
import { validateIdParam } from '@/backend/common/validation/common.schema'
import { TaskService } from '@/backend/tasks/services/task.service'

@injectable()
export class TrashController {
	constructor(@inject(TaskService) private readonly taskService: TaskService) {}

	@IsAuthenticated()
	async getTrash(req: Request) {
		try {
			const trash = await this.taskService.getTrash(req.user!)

			return NextResponse.json(
				{ success: true, message: 'Trash retrieved successfully', data: trash },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TrashController.getTrash')
		}
	}

	@IsAuthenticated()
	async permanentlyDeleteTask(req: Request, id: string) {
		try {
			const validatedId = validateIdParam(id)

			await this.taskService.permanentlyDeleteTask(validatedId, req.user!)

			return NextResponse.json(
				{ success: true, message: 'Task permanently deleted from trash' },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TrashController.permanentlyDeleteTask')
		}
	}

	@IsAuthenticated()
	async emptyTrash(req: Request) {
		try {
			await this.taskService.emptyTrash(req.user!)

			return NextResponse.json(
				{ success: true, message: 'Trash emptied successfully' },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TrashController.emptyTrash')
		}
	}

	@IsAuthenticated()
	async restoreTask(req: Request, id: string) {
		try {
			const validatedId = validateIdParam(id)

			const restoredTask = await this.taskService.restoreTask(validatedId, req.user!)

			return NextResponse.json(
				{
					success: true,
					message: 'Task restored successfully',
					data: restoredTask,
				},
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TrashController.restoreTask')
		}
	}
}
