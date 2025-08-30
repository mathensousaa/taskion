import type {
	PaginatedTasksResponse,
	PaginationQuery,
	Task,
	TaskDbInsert,
	TasksReorderInput,
	TaskUpdateInput,
} from '@/backend/tasks/validation/task.creation.schema'

export interface ITaskRepository {
	create(task: TaskDbInsert): Promise<Task>
	findAll(): Promise<Task[]>
	findAllByUserId(userId: string): Promise<Task[]>
	findAllByUserIdPaginated(
		userId: string,
		pagination: PaginationQuery,
	): Promise<PaginatedTasksResponse>
	findById(id: string): Promise<Task | null>
	update(id: string, task: TaskUpdateInput): Promise<Task>
	delete(id: string): Promise<void>
	reorderTasks(userId: string, reorderData: TasksReorderInput): Promise<Task[]>
	getMaxOrderByUserId(userId: string): Promise<number>
}
