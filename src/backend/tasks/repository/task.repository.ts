import type { Paginated } from '@/backend/common/types'
import type {
	PaginationQuery,
	TaskRepositoryFilters,
} from '@/backend/common/validation/common.schema'
import type {
	Task,
	TaskDbInsert,
	TasksReorderInput,
	TaskUpdateInput,
} from '@/backend/tasks/validation/task.schema'

export interface ITaskRepository {
	create(task: TaskDbInsert): Promise<Task>
	findAll(): Promise<Task[]>
	findAllByUserId(userId: string): Promise<Task[]>
	findAllByUserIdPaginated(userId: string, pagination: PaginationQuery): Promise<Paginated<Task>>
	findAllByUserIdWithFilters(userId: string, filters: TaskRepositoryFilters): Promise<Task[]>
	findAllByUserIdPaginatedWithFilters(
		userId: string,
		pagination: PaginationQuery,
		filters: TaskRepositoryFilters,
	): Promise<Paginated<Task>>
	findById(id: string): Promise<Task | null>
	update(id: string, task: TaskUpdateInput): Promise<Task>
	delete(id: string): Promise<void>
	reorderTasks(userId: string, reorderData: TasksReorderInput): Promise<Task[]>
	getMaxOrderByUserId(userId: string): Promise<number>
	// Trash-related methods
	findTrashByUserId(userId: string): Promise<Task[]>
	findByIdIncludingDeleted(id: string): Promise<Task | null>
	permanentlyDelete(id: string): Promise<void>
	permanentlyDeleteAllByUserId(userId: string): Promise<void>
}
