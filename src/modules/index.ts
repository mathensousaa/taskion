// Export all services for easy importing

export type { AuthResponse, LoginInput } from '@/backend/auth/validation/auth.schema'
export type {
	TaskStatus,
	TaskStatusCreationInput,
	TaskStatusUpdateInput,
} from '@/backend/task-status/validation/task-status.schema'
// Export types for convenience
export type {
	Task,
	TaskCreationInput,
	TaskUpdateInput,
} from '@/backend/tasks/validation/task.schema'
export type {
	User,
	UserCreationInput,
	UserUpdateInput,
} from '@/backend/users/validation/user.schema'
export * from './auth/services'
export * from './task-status/services'
export * from './tasks/services'
export * from './trash/services/trash.service'
export * from './users/services'
