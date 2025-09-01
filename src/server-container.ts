import 'reflect-metadata'
import { container } from 'tsyringe'
import { AuthController } from '@/backend/auth/controllers/auth.controller'
// Auth dependencies
import { AuthService } from '@/backend/auth/services/auth.service'
import { N8nTaskEnhancerAdapter } from '@/backend/task-enhancer/adapters/n8n-task-enhancer.adapter'
import { TaskEnhancerService } from '@/backend/task-enhancer/services/task-enhancer.service'
// Task Status dependencies
import { TaskStatusController } from '@/backend/task-status/controllers/task-status.controller'
import type { ITaskStatusRepository } from '@/backend/task-status/repository/task-status.repository'
import { TaskStatusRepositorySupabase } from '@/backend/task-status/repository/task-status.repository.supabase'
import { TaskStatusService } from '@/backend/task-status/services/task-status.service'
import { TaskController } from '@/backend/tasks/controllers/task.controller'
import { TrashController } from '@/backend/tasks/controllers/trash.controller'
import type { ITaskRepository } from '@/backend/tasks/repository/task.repository'
import { TaskRepositorySupabase } from '@/backend/tasks/repository/task.repository.supabase'
// Task dependencies
import { TaskService } from '@/backend/tasks/services/task.service'
// User dependencies
import { UserController } from '@/backend/users/controllers/user.controller'
import { UserRepositorySupabase } from '@/backend/users/repository/user.repository.supabase'
import { UserService } from '@/backend/users/services/user.service'
import { n8nClient } from '@/configs/fetch-clients'
import type { FetchClient } from '@/lib/fetch-client'
import type { User } from '@/modules'

declare global {
	interface Request {
		user?: User
	}
}

// Register repositories
container.register<ITaskRepository>('ITaskRepository', { useClass: TaskRepositorySupabase })
container.register<ITaskStatusRepository>('ITaskStatusRepository', {
	useClass: TaskStatusRepositorySupabase,
})
container.register('IUserRepository', { useClass: UserRepositorySupabase })

// Register external clients
container.register<FetchClient>('N8nClient', { useValue: n8nClient })

// Register adapters
container.register(N8nTaskEnhancerAdapter, { useClass: N8nTaskEnhancerAdapter })

// Register services
container.register(TaskEnhancerService, TaskEnhancerService)
container.register(TaskService, TaskService)
container.register(TaskStatusService, TaskStatusService)
container.register(UserService, UserService)
container.register(AuthService, AuthService)

// Register controllers
container.register(TaskController, TaskController)
container.register(TrashController, TrashController)
container.register(TaskStatusController, TaskStatusController)
container.register(UserController, UserController)
container.register(AuthController, AuthController)

console.log('Server container registered')

export const n8nTaskEnhancerAdapter = container.resolve(N8nTaskEnhancerAdapter)
export const taskEnhancerService = container.resolve(TaskEnhancerService)

export const userController = container.resolve(UserController)
export const userService = container.resolve(UserService)

export const taskController = container.resolve(TaskController)
export const taskService = container.resolve(TaskService)
export const trashController = container.resolve(TrashController)

export const taskStatusController = container.resolve(TaskStatusController)
export const taskStatusService = container.resolve(TaskStatusService)

export const authController = container.resolve(AuthController)
export const authService = container.resolve(AuthService)

console.log('Server container resolved')
