# Authentication Decorators

This module provides TypeScript decorators for implementing authentication in your Next.js API routes using Clean Architecture principles.

## Available Decorators

### 1. `@Authenticated()`
Basic authentication decorator that checks for valid HTTP-only cookies.

```typescript
@Authenticated()
async getProtectedData() {
    // This method will only execute if a valid session cookie exists
    return { data: 'protected content' }
}
```

### 2. `@AuthenticatedWithUser()`
Authentication decorator that provides the user's email from the session.

```typescript
@AuthenticatedWithUser()
async getUserProfile(authenticatedUser: { email: string }) {
    // authenticatedUser.email contains the user's email from the session
    return { email: authenticatedUser.email }
}
```

### 3. `@AuthenticatedUser()`
Advanced authentication decorator that validates the user against the database and provides the full user object.

```typescript
@AuthenticatedUser()
async getTasks(authenticatedUser: User) {
    // authenticatedUser contains the full User object from the database
    // You can access: authenticatedUser.id, authenticatedUser.email, authenticatedUser.name
    return await this.taskService.getTasksByUserId(authenticatedUser.id)
}
```

### 4. `@AuthenticatedUserWithPermission(permission?)`
Authentication decorator with permission checking (extensible for role-based access control).

```typescript
@AuthenticatedUserWithPermission('admin')
async deleteUser(authenticatedUser: User, userId: string) {
    // Only users with 'admin' permission can access this method
    return await this.userService.deleteUser(userId)
}
```

## Usage Examples

### Protecting Controller Methods

```typescript
import { AuthenticatedUser } from '@/backend/common/decorators'

@injectable()
export class TaskController {
    constructor(@inject(TaskService) private readonly service: TaskService) {}

    @AuthenticatedUser()
    async createTask(authenticatedUser: User, req: Request) {
        const body = await req.json()
        const taskData = { ...body, user_id: authenticatedUser.id }
        
        const task = await this.service.createTask(taskData)
        return NextResponse.json({ success: true, task })
    }

    @AuthenticatedUser()
    async getMyTasks(authenticatedUser: User) {
        // Filter tasks by the authenticated user
        const tasks = await this.service.getTasksByUserId(authenticatedUser.id)
        return NextResponse.json({ success: true, tasks })
    }
}
```

### Route Handler Integration

The decorators work seamlessly with your existing route handlers. The authentication check happens automatically when the controller method is called.

```typescript
// src/app/api/tasks/route.ts
export async function GET() {
    return await controller.getMyTasks() // @AuthenticatedUser() decorator will handle auth
}
```

## Error Handling

All decorators throw `UnauthorizedError` when authentication fails, which integrates with your existing error handling system:

- **Missing cookie**: "Authentication required"
- **Invalid session**: "Invalid session - user not found"
- **Missing permission**: "Permission 'X' required" (when using permission decorator)

## Security Features

- **HTTP-only cookies**: Session cookies are secure and cannot be accessed by JavaScript
- **Database validation**: User sessions are validated against the database
- **Automatic cleanup**: Invalid sessions are automatically rejected
- **Type safety**: Full TypeScript support with proper typing

## Best Practices

1. **Use `@AuthenticatedUser()` for most protected routes** - Provides full user context
2. **Use `@Authenticated()` for simple protection** - When you only need to check if user is logged in
3. **Implement permission checks in the decorator** - Extend `@AuthenticatedUserWithPermission()` for role-based access
4. **Always validate user ownership** - Check if resources belong to the authenticated user
5. **Handle errors gracefully** - Let the ErrorHandler manage authentication failures

## Integration with Clean Architecture

The decorators integrate seamlessly with your existing architecture:

- **Controllers**: Apply decorators to controller methods
- **Services**: Access authenticated user context from controllers
- **Repositories**: User validation happens at the decorator level
- **Error Handling**: Uses your existing error classes and ErrorHandler
- **Dependency Injection**: Works with tsyringe container resolution
