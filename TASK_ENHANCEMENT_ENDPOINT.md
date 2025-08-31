# Task Enhancement Endpoint

## Overview

The Task Enhancement endpoint (`POST /api/tasks/:id/enhance`) allows users and external integrations to enhance task descriptions using AI-powered enhancement.

## Endpoint Details

- **URL:** `POST /api/tasks/:id/enhance`
- **Authentication:** Required (supports both session-based and API key authentication)
- **Description:** Enhances a task description using the TaskEnhancerService

## Authentication Methods

### 1. Session-based Authentication (User Interface)
- Requires a valid session cookie
- User must be the owner of the task
- No additional headers or body required

### 2. API Key Authentication (External Integrations)
- Requires `x-api-key` header with valid API key
- Request body must contain `user_id` (UUID format)
- Useful for n8n workflows and other external integrations

## Usage Examples

### Session-based Authentication
```bash
curl -X POST http://localhost:3000/api/tasks/123e4567-e89b-12d3-a456-426614174000/enhance \
  -H "Cookie: session=your-session-cookie" \
  -H "Content-Type: application/json"
```

### API Key Authentication
```bash
curl -X POST http://localhost:3000/api/tasks/123e4567-e89b-12d3-a456-426614174000/enhance \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user-uuid-here"}'
```

## Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Task description successfully enhanced",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Task Title",
    "description": "Enhanced task description...",
    "status_id": "status-uuid",
    "user_id": "user-uuid",
    "order": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "deleted_at": null
  }
}
```

### Error Responses

#### Task Not Found (404)
```json
{
  "success": false,
  "message": "Task not found"
}
```

#### Unauthorized (401)
```json
{
  "success": false,
  "message": "Authentication required"
}
```

#### Forbidden (403)
```json
{
  "success": false,
  "message": "Access denied: Task does not belong to authenticated user"
}
```

## Environment Variables

Make sure to set the following environment variable:

```bash
TASK_ENHANCER_SECRET=your-secure-api-key-here
```

## Implementation Details

- **Controller:** `TaskController.enhance()` method
- **Service:** `TaskEnhancerService.enhanceTask()` method
- **Route:** `src/app/api/tasks/[id]/enhance/route.ts`
- **Authentication:** `@IsAuthenticated({ allowApiKey: true })` decorator

## Security Features

1. **Task Ownership Validation:** Users can only enhance their own tasks
2. **API Key Validation:** External integrations must provide valid API key
3. **User ID Validation:** API key requests must include valid user_id
4. **Centralized Error Handling:** Consistent error responses across the API

## Integration with n8n

This endpoint is designed to work seamlessly with n8n workflows:

1. Set up an n8n HTTP Request node
2. Use the API key authentication method
3. Include the user_id in the request body
4. The enhanced task will be returned with improved description

## Notes

- The enhancement process is synchronous - the endpoint waits for completion before responding
- Task enhancement is handled by the existing TaskEnhancerService
- No additional request body is required for session-based authentication
- The endpoint follows the same error handling patterns as other API endpoints
