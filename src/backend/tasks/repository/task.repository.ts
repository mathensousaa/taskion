import type { PaginatedApiResponse } from '@/backend/common/types'
import type { PaginationQuery } from '@/backend/common/validation/common.schema'
import type {
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
	): Promise<PaginatedApiResponse<Task>>
	findById(id: string): Promise<Task | null>
	update(id: string, task: TaskUpdateInput): Promise<Task>
	delete(id: string): Promise<void>
	reorderTasks(userId: string, reorderData: TasksReorderInput): Promise<Task[]>
	getMaxOrderByUserId(userId: string): Promise<number>
}
