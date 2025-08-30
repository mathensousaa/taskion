# Tasks Module

This module implements a complete CRUD system for tasks with infinite scroll pagination, cursor-based navigation, and drag & drop reordering capabilities.

## Features

- **Cursor-based Pagination**: Efficient infinite scroll with cursor-based navigation
- **Proper Ordering**: Tasks are sorted by `order` ASC, `created_at` ASC, `id` ASC
- **Drag & Drop Support**: Integer-based ordering system compatible with drag & drop operations
- **User Isolation**: All operations respect authenticated user ownership
- **Clean Architecture**: Controller → Service → Repository pattern with dependency injection

## Database Schema

The `tasks` table has the following structure:

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  status_id UUID REFERENCES task_status(id),
  order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for efficient pagination and ordering
CREATE INDEX idx_tasks_user_order ON tasks(user_id, order, created_at, id);
CREATE INDEX idx_tasks_user_deleted ON tasks(user_id, deleted_at);
```

## API Endpoints

### GET /api/tasks
Retrieve tasks with pagination.

**Query Parameters:**
- `limit` (optional): Number of tasks per page (1-100, default: 20)
- `cursor` (optional): Base64 encoded cursor for pagination

**Response:**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [...],
  "nextCursor": {
    "order": 5,
    "created_at": "2024-01-01T00:00:00Z",
    "id": "uuid-here"
  },
  "hasMore": true
}
```

### POST /api/tasks
Create a new task.

**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Optional description",
  "status_id": "optional-status-uuid"
}
```

**Note:** The `order` field is automatically calculated and assigned.

### PATCH /api/tasks
Reorder tasks (for drag & drop operations).

**Request Body:**
```json
[
  {
    "taskId": "uuid-1",
    "newOrder": 0
  },
  {
    "taskId": "uuid-2", 
    "newOrder": 1
  }
]
```

### PUT /api/tasks/[id]
Update an existing task.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status_id": "new-status-uuid",
  "order": 5
}
```

### DELETE /api/tasks/[id]
Soft delete a task (sets `deleted_at` timestamp).

## Cursor-based Pagination

The pagination system uses a composite cursor consisting of:
- `order`: Integer order value
- `created_at`: Timestamp for tie-breaking
- `id`: UUID for final tie-breaking

This ensures consistent ordering even when multiple tasks have the same `order` value.

### Frontend Usage Example

```typescript
import { encodeCursor, decodeCursor } from '@/lib/utils'

// Initial request
const response = await fetch('/api/tasks?limit=20')
const data = await response.json()

// Store cursor for next page
let nextCursor = data.nextCursor

// Load next page
const loadNextPage = async () => {
  if (!nextCursor || !data.hasMore) return
  
  const encodedCursor = encodeCursor(nextCursor)
  const nextResponse = await fetch(`/api/tasks?limit=20&cursor=${encodedCursor}`)
  const nextData = await nextResponse.json()
  
  // Append new tasks
  tasks.push(...nextData.tasks)
  nextCursor = nextData.nextCursor
}
```

## Drag & Drop Reordering

The reordering system maintains integer-based ordering:

1. **Batch Updates**: Multiple tasks can be reordered in a single request
2. **Order Adjustment**: Other tasks are automatically reordered to maintain consistency
3. **No Decimals**: Uses integer values only, avoiding floating-point precision issues

### Reordering Algorithm

1. Fetch current task orders for the user
2. Apply explicit reordering requests
3. Adjust remaining task orders to fill gaps
4. Update all affected tasks in a single batch operation
5. Return updated tasks in correct order

## Security Features

- **User Isolation**: All operations filter by `user_id`
- **Authentication Required**: All endpoints require valid authentication
- **Ownership Validation**: Users can only access/modify their own tasks
- **Input Validation**: Zod schemas validate all input data

## Error Handling

The module includes comprehensive error handling:

- **Validation Errors**: Invalid input data
- **Unauthorized Errors**: Access to other users' tasks
- **Not Found Errors**: Non-existent tasks
- **Database Errors**: Supabase operation failures

## Performance Considerations

- **Efficient Indexing**: Database indexes on `(user_id, order, created_at, id)`
- **Cursor-based Pagination**: O(1) performance regardless of page number
- **Batch Operations**: Reordering uses minimal database round trips
- **Soft Deletes**: Maintains referential integrity while preserving data

## Testing

The module is designed for easy testing:

- **Dependency Injection**: Services and repositories can be easily mocked
- **Interface-based Design**: Repository interface allows for test implementations
- **Pure Functions**: Business logic is separated from infrastructure concerns

## Future Enhancements

- **Bulk Operations**: Batch create/update/delete operations
- **Advanced Filtering**: Status, date range, and text search filters
- **Real-time Updates**: WebSocket integration for collaborative editing
- **Audit Trail**: Track all changes to task ordering
