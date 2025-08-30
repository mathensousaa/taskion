# Taskion API Documentation

## Overview

The Taskion API provides a comprehensive set of endpoints for managing tasks, users, authentication, and task statuses. All endpoints are RESTful and follow standard HTTP methods.

**Base URL:** `http://localhost:3000/api`

## Authentication

Most endpoints require authentication. The API uses a session-based authentication system where users login with their email address.

## Modules

### 1. Tasks Module

The Tasks module handles all task-related operations including creation, retrieval, updates, deletion, and reordering.

#### Endpoints

##### List All Tasks
- **Method:** `GET`
- **URL:** `/tasks`
- **Description:** Retrieves a paginated list of tasks for the authenticated user
- **Authentication:** Required
- **Query Parameters:**
  - `limit` (optional): Number of tasks to return (default: 20, max: 100)
  - `cursor` (optional): Pagination cursor for paginated results
- **Response:** Paginated list of tasks with metadata

##### Create Task
- **Method:** `POST`
- **URL:** `/tasks`
- **Description:** Creates a new task for the authenticated user
- **Authentication:** Required
- **Request Body:**
```json
{
    "title": "Task Title",
    "description": "Task description (optional)",
    "status_id": "uuid-of-status (optional)"
}
```
- **Response:** Created task object

##### Get Task by ID
- **Method:** `GET`
- **URL:** `/tasks/:id`
- **Description:** Retrieves a specific task by its ID
- **Authentication:** Required
- **URL Parameters:**
  - `id`: Task UUID
- **Response:** Task object

##### Update Task
- **Method:** `PUT`
- **URL:** `/tasks/:id`
- **Description:** Updates an existing task
- **Authentication:** Required
- **URL Parameters:**
  - `id`: Task UUID
- **Request Body:**
```json
{
    "title": "Updated Title (optional)",
    "description": "Updated description (optional)",
    "status_id": "new-status-uuid (optional)",
    "order": 1
}
```
- **Response:** Updated task object

##### Delete Task
- **Method:** `DELETE`
- **URL:** `/tasks/:id`
- **Description:** Soft deletes a task (marks as deleted)
- **Authentication:** Required
- **URL Parameters:**
  - `id`: Task UUID
- **Response:** Success confirmation

##### Reorder Tasks
- **Method:** `PATCH`
- **URL:** `/tasks`
- **Description:** Reorders multiple tasks by updating their order values
- **Authentication:** Required
- **Request Body:**
```json
[
    {
        "taskId": "task-uuid-1",
        "newOrder": 0
    },
    {
        "taskId": "task-uuid-2",
        "newOrder": 1
    }
]
```
- **Response:** Success confirmation

---

### 2. Authentication Module

The Authentication module handles user login, logout, and current user information.

#### Endpoints

##### Login
- **Method:** `POST`
- **URL:** `/login`
- **Description:** Authenticates a user with their email address
- **Authentication:** Not required
- **Request Body:**
```json
{
    "email": "user@example.com"
}
```
- **Response:** Authentication response with user information and session

##### Logout
- **Method:** `POST`
- **URL:** `/logout`
- **Description:** Logs out the current user and invalidates their session
- **Authentication:** Required
- **Request Body:** None
- **Response:** Success confirmation

##### Get Current User
- **Method:** `GET`
- **URL:** `/me`
- **Description:** Retrieves information about the currently authenticated user
- **Authentication:** Required
- **Request Body:** None
- **Response:** Current user object

---

### 3. Users Module

The Users module manages user accounts and profiles.

#### Endpoints

##### List All Users
- **Method:** `GET`
- **URL:** `/users`
- **Description:** Retrieves a list of all users in the system
- **Authentication:** Required
- **Request Body:** None
- **Response:** Array of user objects

##### Create User
- **Method:** `POST`
- **URL:** `/users`
- **Description:** Creates a new user account
- **Authentication:** Required
- **Request Body:**
```json
{
    "name": "User Full Name",
    "email": "user@example.com"
}
```
- **Response:** Created user object

##### Get User by ID
- **Method:** `GET`
- **URL:** `/users/:id`
- **Description:** Retrieves a specific user by their ID
- **Authentication:** Required
- **URL Parameters:**
  - `id`: User UUID
- **Request Body:** None
- **Response:** User object

##### Update User
- **Method:** `PUT`
- **URL:** `/users/:id`
- **Description:** Updates an existing user's information
- **Authentication:** Required
- **URL Parameters:**
  - `id`: User UUID
- **Request Body:**
```json
{
    "name": "Updated Name (optional)",
    "email": "updated.email@example.com (optional)"
}
```
- **Response:** Updated user object

##### Delete User
- **Method:** `DELETE`
- **URL:** `/users/:id`
- **Description:** Deletes a user account
- **Authentication:** Required
- **URL Parameters:**
  - `id`: User UUID
- **Request Body:** None
- **Response:** Success confirmation

---

### 4. Task Status Module

The Task Status module manages the different states a task can be in (e.g., "To Do", "In Progress", "Done").

#### Endpoints

##### List All Task Statuses
- **Method:** `GET`
- **URL:** `/task-status`
- **Description:** Retrieves a list of all available task statuses
- **Authentication:** Required
- **Request Body:** None
- **Response:** Array of task status objects

##### Create Task Status
- **Method:** `POST`
- **URL:** `/task-status`
- **Description:** Creates a new task status
- **Authentication:** Required
- **Request Body:**
```json
{
    "name": "Status Name",
    "slug": "status-slug",
    "color": "#3B82F6",
    "icon": "icon-name",
    "order": 1
}
```
- **Response:** Created task status object

##### Get Task Status by ID
- **Method:** `GET`
- **URL:** `/task-status/:id`
- **Description:** Retrieves a specific task status by its ID
- **Authentication:** Required
- **URL Parameters:**
  - `id`: Task Status UUID
- **Request Body:** None
- **Response:** Task status object

##### Update Task Status
- **Method:** `PUT`
- **URL:** `/task-status/:id`
- **Description:** Updates an existing task status
- **Authentication:** Required
- **URL Parameters:**
  - `id`: Task Status UUID
- **Request Body:**
```json
{
    "name": "Updated Status Name (optional)",
    "slug": "updated-slug (optional)",
    "color": "#10B981 (optional)",
    "icon": "updated-icon (optional)",
    "order": 2
}
```
- **Response:** Updated task status object

##### Delete Task Status
- **Method:** `DELETE`
- **URL:** `/task-status/:id`
- **Description:** Deletes a task status
- **Authentication:** Required
- **URL Parameters:**
  - `id`: Task Status UUID
- **Request Body:** None
- **Response:** Success confirmation

---

## Data Models

### Task Object
```json
{
    "id": "uuid",
    "title": "string",
    "description": "string | null",
    "status_id": "uuid",
    "user_id": "uuid",
    "order": "number",
    "created_at": "ISO timestamp",
    "deleted_at": "ISO timestamp | null",
    "updated_at": "ISO timestamp | null"
}
```

### User Object
```json
{
    "id": "uuid",
    "name": "string",
    "email": "string",
    "created_at": "ISO timestamp"
}
```

### Task Status Object
```json
{
    "id": "uuid",
    "name": "string",
    "slug": "string",
    "color": "string",
    "icon": "string",
    "order": "number",
    "created_at": "ISO timestamp"
}
```

### Authentication Response
```json
{
    "success": "boolean",
    "message": "string | null",
    "user": {
        "id": "string",
        "email": "string",
        "name": "string"
    } | null
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- **200 OK:** Successful operation
- **201 Created:** Resource successfully created
- **400 Bad Request:** Invalid request data
- **401 Unauthorized:** Authentication required
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server error

Error responses include:
```json
{
    "error": "Error message",
    "details": "Additional error details"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Security Considerations

- All endpoints (except login) require authentication
- User data is isolated by authenticated user
- Input validation is performed using Zod schemas
- SQL injection protection through Supabase
- Session-based authentication

## Development Notes

- The API is built with Next.js 14 App Router
- Uses Supabase as the backend database
- Implements cursor-based pagination for large datasets
- Soft delete is used for tasks (deleted_at field)
- Task ordering is managed through an order field
