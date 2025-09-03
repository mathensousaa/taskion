import { NextResponse } from 'next/server'
import { inject, injectable } from 'tsyringe'
import { IsAuthenticated } from '@/backend/common/decorators'
import { ErrorHandler } from '@/backend/common/errors/error-handler'
import {
	PaginationQuerySchema,
	TaskFiltersSchema,
	validateIdParam,
} from '@/backend/common/validation/common.schema'
import { TaskEnhancerService } from '@/backend/task-enhancer/services/task-enhancer.service'
import { TaskService } from '@/backend/tasks/services/task.service'
import {
	TaskCreationSchema,
	TasksReorderSchema,
	TaskUpdateSchema,
} from '@/backend/tasks/validation/task.schema'

@injectable()
export class TaskController {
	constructor(
		@inject(TaskService) private readonly service: TaskService,
		@inject(TaskEnhancerService) private readonly taskEnhancerService: TaskEnhancerService,
	) {}

	@IsAuthenticated({ allowApiKeyWithUserId: true, allowEmailToken: true })
	async create(req: Request) {
		try {
			const body = await req.json()
			const data = TaskCreationSchema.parse(body)

			const task = await this.service.createTask(data, req.user!)

			return NextResponse.json(
				{ success: true, message: 'Task successfully created', data: task },
				{ status: 201 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskController.create')
		}
	}

	@IsAuthenticated({ allowApiKeyWithUserId: true, allowEmailToken: true })
	async getAll(req: Request) {
		try {
			// Parse query parameters for filters only (no pagination)
			const url = new URL(req.url)
			const filters = TaskFiltersSchema.parse({
				status: url.searchParams.get('status'),
			})

			// Use filtered method if filters are provided, otherwise get all tasks
			const tasks = Object.values(filters).some((value) => value !== undefined)
				? await this.service.getTasksWithFilters(req.user!, filters)
				: await this.service.getAllTasks(req.user!)

			return NextResponse.json(
				{
					success: true,
					message: 'Tasks retrieved successfully',
					data: tasks,
				},
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskController.getAll')
		}
	}

	@IsAuthenticated({ allowApiKeyWithUserId: true, allowEmailToken: true })
	async getPaginated(req: Request) {
		try {
			// Parse query parameters for pagination and filters
			const url = new URL(req.url)
			const pagination = PaginationQuerySchema.parse({
				limit: url.searchParams.get('limit'),
				cursor: url.searchParams.get('cursor')
					? JSON.parse(url.searchParams.get('cursor')!)
					: undefined,
			})

			const filters = TaskFiltersSchema.parse({
				status: url.searchParams.get('status'),
			})

			// Use filtered method if filters are provided, otherwise use regular pagination
			const result = Object.values(filters).some((value) => value !== undefined)
				? await this.service.getTasksPaginatedWithFilters(req.user!, pagination, filters)
				: await this.service.getTasksPaginated(req.user!, pagination)

			return NextResponse.json(
				{
					...result,
					success: true,
					message: 'Tasks retrieved successfully',
				},
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskController.getPaginated')
		}
	}

	@IsAuthenticated({ allowApiKeyWithUserId: true, allowEmailToken: true })
	async getById(req: Request, id: string) {
		try {
			const validatedId = validateIdParam(id)

			const task = await this.service.getTaskById(validatedId, req.user!)

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

	@IsAuthenticated({ allowApiKeyWithUserId: true, allowEmailToken: true })
	async update(req: Request, id: string) {
		try {
			const validatedId = validateIdParam(id)

			const body = await req.json()
			const data = TaskUpdateSchema.parse(body)

			const task = await this.service.updateTask(validatedId, data, req.user!)

			return NextResponse.json(
				{ success: true, message: 'Task successfully updated', data: task },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskController.update')
		}
	}

	@IsAuthenticated({ allowApiKeyWithUserId: true, allowEmailToken: true })
	async delete(req: Request, id: string) {
		try {
			const validatedId = validateIdParam(id)

			await this.service.deleteTask(validatedId, req.user!)

			return NextResponse.json(
				{ success: true, message: 'Task successfully deleted' },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskController.delete')
		}
	}

	@IsAuthenticated({ allowApiKeyWithUserId: true, allowEmailToken: true })
	async reorder(req: Request) {
		try {
			const body = await req.json()
			const data = TasksReorderSchema.parse(body)

			const tasks = await this.service.reorderTasks(req.user!, data)

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

	@IsAuthenticated({ allowApiKeyWithUserId: true, allowEmailToken: true })
	async enhance(req: Request, id: string) {
		try {
			const validatedId = validateIdParam(id)

			const task = await this.service.getTaskById(validatedId, req.user!)

			if (!task) {
				return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 })
			}

			const enhancedTask = await this.taskEnhancerService.enhanceTask(task)

			return NextResponse.json(
				{
					success: true,
					message: 'Task description successfully enhanced',
					data: enhancedTask,
				},
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskController.enhance')
		}
	}

	@IsAuthenticated({ allowApiKeyWithUserId: true, allowEmailToken: true })
	async toggleStatus(req: Request, id: string) {
		try {
			const validatedId = validateIdParam(id)

			const task = await this.service.toggleTaskStatus(validatedId, req.user!)

			return NextResponse.json(
				{
					success: true,
					message: 'Task status successfully toggled',
					data: task,
				},
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'TaskController.toggleStatus')
		}
	}
}
