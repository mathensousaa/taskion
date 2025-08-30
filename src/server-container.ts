import 'reflect-metadata'
import { container } from 'tsyringe'
import { AuthController } from '@/backend/auth/controllers/auth.controller'
// Auth dependencies
import { AuthService } from '@/backend/auth/services/auth.service'
// Task Status dependencies
import { TaskStatusController } from '@/backend/task-status/controllers/task-status.controller'
import type { ITaskStatusRepository } from '@/backend/task-status/repository/task-status.repository'
import { TaskStatusRepositorySupabase } from '@/backend/task-status/repository/task-status.repository.supabase'
import { TaskStatusService } from '@/backend/task-status/services/task-status.service'
import { TaskController } from '@/backend/tasks/controllers/task.controller'
import type { ITaskRepository } from '@/backend/tasks/repository/task.repository'
import { TaskRepositorySupabase } from '@/backend/tasks/repository/task.repository.supabase'
// Task dependencies
import { TaskService } from '@/backend/tasks/services/task.service'
// User dependencies
import { UserController } from '@/backend/users/controllers/user.controller'
import { UserRepositorySupabase } from '@/backend/users/repository/user.repository.supabase'
import { UserService } from '@/backend/users/services/user.service'

// Register repositories
container.register<ITaskRepository>('ITaskRepository', { useClass: TaskRepositorySupabase })
container.register<ITaskStatusRepository>('ITaskStatusRepository', {
	useClass: TaskStatusRepositorySupabase,
})
container.register('IUserRepository', { useClass: UserRepositorySupabase })

// Register services
container.register(TaskService, TaskService)
container.register(TaskStatusService, TaskStatusService)
container.register(UserService, UserService)
container.register(AuthService, AuthService)

// Register controllers
container.register(TaskController, TaskController)
container.register(TaskStatusController, TaskStatusController)
container.register(UserController, UserController)
container.register(AuthController, AuthController)

console.log('Server container registered')

export const userController = container.resolve(UserController)
export const userService = container.resolve(UserService)

export const taskController = container.resolve(TaskController)
export const taskService = container.resolve(TaskService)

export const taskStatusController = container.resolve(TaskStatusController)
export const taskStatusService = container.resolve(TaskStatusService)

export const authController = container.resolve(AuthController)
export const authService = container.resolve(AuthService)

console.log('Server container resolved')
