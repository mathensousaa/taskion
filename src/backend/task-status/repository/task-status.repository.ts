import type {
	TaskStatus,
	TaskStatusCreationInput,
	TaskStatusUpdateInput,
} from '@/backend/task-status/validation/task-status.schema'

export interface ITaskStatusRepository {
	create(taskStatus: TaskStatusCreationInput): Promise<TaskStatus>
	findAll(): Promise<TaskStatus[]>
	findById(id: string): Promise<TaskStatus | null>
	findBySlug(slug: string): Promise<TaskStatus | null>
	update(id: string, taskStatus: TaskStatusUpdateInput): Promise<TaskStatus>
	delete(id: string): Promise<void>
}
