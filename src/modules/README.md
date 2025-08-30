# Frontend Services Layer

This directory contains the frontend services layer for the Taskion Next.js application. The services are designed to work with Server Components and follow Next.js App Router best practices.

## Architecture

- **Object-based services**: Each service is exported as a plain object with methods, not classes
- **Type-safe**: All services use Zod schemas for request/response validation
- **Caching strategies**: Proper cache strategies for different types of data
- **Error handling**: Centralized error handling with custom `ApiError` class

## Services

### Tasks Service (`tasks.service.ts`)
- `list(limit?, cursor?)` - Get paginated list of tasks (cached)
- `getById(id)` - Get single task by ID (cached)
- `create(data)` - Create new task (no cache)
- `update(id, data)` - Update existing task (no cache)
- `delete(id)` - Delete task (no cache)
- `reorder(tasks)` - Reorder tasks (no cache)

### Users Service (`users.service.ts`)
- `list()` - Get all users (cached)
- `getById(id)` - Get single user by ID (cached)
- `create(data)` - Create new user (no cache)
- `update(id, data)` - Update existing user (no cache)
- `delete(id)` - Delete user (no cache)

### Task Status Service (`task-status.service.ts`)
- `list()` - Get all task statuses (cached)
- `getById(id)` - Get single status by ID (cached)
- `create(data)` - Create new status (no cache)
- `update(id, data)` - Update existing status (no cache)
- `delete(id)` - Delete status (no cache)

### Auth Service (`auth.service.ts`)
- `login(data)` - Authenticate user (no cache)
- `logout()` - Logout user (no cache)
- `me()` - Get current user (no cache)

## Usage Examples

### In Server Components

```tsx
import { tasksService, usersService } from '@/modules'

// Server Component
export default async function TasksPage() {
  // This will be cached
  const tasks = await tasksService.list(20)
  const users = await usersService.list()
  
  return (
    <div>
      {/* Render tasks and users */}
    </div>
  )
}
```

### With ISR (Incremental Static Regeneration)

```tsx
import { taskStatusService } from '@/modules'

export default async function StatusPage() {
  const statuses = await taskStatusService.list()
  
  return (
    <div>
      {/* Render statuses */}
    </div>
  )
}

// Revalidate every hour
export const revalidate = 3600
```

### Error Handling

```tsx
import { tasksService } from '@/modules'
import { ApiError } from '@/lib/api-client'

export default async function TaskPage({ params }: { params: { id: string } }) {
  try {
    const task = await tasksService.getById(params.id)
    return <div>{task.title}</div>
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        return <div>Task not found</div>
      }
      return <div>Error: {error.message}</div>
    }
    return <div>An unexpected error occurred</div>
  }
}
```

## Caching Strategies

- **`cache: 'force-cache'`**: Used for read-only operations (GET requests) that return semi-static data
- **`cache: 'no-store'`**: Used for mutable operations (POST, PUT, DELETE) and authentication endpoints

## Environment Configuration

The services use the `API_URL` environment variable from `src/configs/environment.ts`. Make sure this is properly configured in your environment.

## Type Safety

All services return properly typed responses based on Zod schemas. The types are automatically inferred from the schemas, ensuring type safety throughout your application.
