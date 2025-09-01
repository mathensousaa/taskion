# Trash Module

The Trash module provides functionality for managing soft-deleted tasks in the task management system.

## Features

- **View Trash**: Display all soft-deleted tasks belonging to the authenticated user
- **Permanently Delete Tasks**: Remove individual tasks from trash permanently
- **Empty Trash**: Permanently delete all tasks in trash at once
- **Task Information**: Show task title, description, and deletion date
- **Confirmation Dialogs**: Require user confirmation before destructive actions

## Components

### TrashList
Main component that displays the trash interface with:
- Header showing task count and empty trash button
- List of soft-deleted tasks
- Loading and error states
- Empty state when no tasks exist

### TrashTaskCard
Individual task card component showing:
- Task title and description (with strikethrough styling)
- Deletion date and time
- Actions menu for permanent deletion

### EmptyTrashState
Displayed when no tasks exist in trash, with:
- Informative message
- Link back to main tasks page

### DeleteTaskDialog
Confirmation dialog for permanently deleting individual tasks.

### EmptyTrashDialog
Confirmation dialog for emptying the entire trash.

## Services

### trashService
API client for trash operations:
- `getTrash()`: Retrieve all soft-deleted tasks
- `permanentlyDeleteTask(id)`: Permanently delete a specific task
- `emptyTrash()`: Permanently delete all tasks in trash

## API Endpoints

- `GET /api/trash` - List all soft-deleted tasks
- `DELETE /api/trash/:id` - Permanently delete a specific task
- `DELETE /api/trash` - Empty the entire trash

## Usage

The trash module is accessible via the `/trash` route and is integrated into the main application sidebar.

## Security

All operations are restricted to tasks belonging to the authenticated user. The system verifies ownership before allowing any destructive operations.
