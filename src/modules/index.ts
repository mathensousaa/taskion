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
export { authService } from './auth/services/auth.service'
export { taskStatusService } from './task-status/services/task-status.service'
export { tasksService } from './tasks/services/tasks.service'
export { usersService } from './users/services/users.service'
