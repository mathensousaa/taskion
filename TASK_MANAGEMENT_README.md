# Task Management System

A comprehensive task management system built with Next.js, featuring a Notion-like interface with drag & drop functionality, inline editing, and real-time search.

## Features

### 🎯 Core Functionality
- **Task Creation**: Quick-create tasks with inline input
- **Task Management**: Edit titles and descriptions inline
- **Drag & Drop**: Reorder tasks with intuitive drag handles
- **Real-time Search**: Filter tasks by title or description
- **Infinite Scroll**: Load tasks dynamically as you scroll

### 🎨 User Experience
- **Notion-like Design**: Clean, modern interface using Shadcn components
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Context Menus**: Right-click for quick actions (edit, delete)
- **Loading States**: Elegant loading and error handling
- **Optimistic Updates**: Immediate UI feedback for better UX

### 🏗️ Architecture
- **Next.js 15**: Latest features with App Router
- **Server Components**: Optimal data fetching and caching
- **Client Components**: Only where interactivity is needed
- **Clean Architecture**: Follows SRP and modular design principles
- **TypeScript**: Full type safety throughout the application

## Components Structure

```
src/components/tasks/
├── task-card.tsx           # Individual task card with inline editing
├── task-list.tsx           # Main task list with drag & drop
├── task-search.tsx         # Search input with real-time filtering
├── quick-create-task.tsx   # Fast task creation component
├── sortable-task-card.tsx  # Drag & drop wrapper for task cards
├── empty-state.tsx         # Empty state when no tasks exist
├── loading-state.tsx       # Loading skeleton for tasks
├── error-state.tsx         # Error handling component
└── task-list-skeleton.tsx  # Loading skeleton for the entire list
```

## Usage

### Creating Tasks
1. Click the "Quick add task" button
2. Type your task title
3. Press Enter or click "Add"

### Editing Tasks
1. **Title**: Click on the task title to edit inline
2. **Description**: Click on the description or "+ Add description" to edit
3. **Save**: Press Enter or click outside the input
4. **Cancel**: Press Escape to cancel changes

### Reordering Tasks
1. Hover over a task to see the drag handle (⋮⋮)
2. Click and drag the handle to reorder
3. Drop the task in the desired position

### Searching Tasks
1. Use the search bar at the top
2. Type to filter tasks in real-time
3. Clear search with the X button

### Managing Tasks
1. **Context Menu**: Right-click on any task
2. **Quick Actions**: Edit title, edit description, or delete
3. **Keyboard Shortcuts**: Enter to save, Escape to cancel

## API Integration

The system integrates with your existing backend:

- **GET /api/tasks**: Fetch tasks with pagination
- **POST /api/tasks**: Create new tasks
- **PUT /api/tasks/[id]**: Update existing tasks
- **DELETE /api/tasks/[id]**: Delete tasks
- **PATCH /api/tasks**: Reorder tasks

## State Management

- **Local State**: Component-level state for UI interactions
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Graceful fallbacks and retry mechanisms
- **Caching**: Efficient data fetching with Next.js caching

## Performance Features

- **Infinite Scroll**: Load only visible tasks
- **Debounced Search**: Efficient search without excessive API calls
- **Optimistic Updates**: Fast UI responses
- **Lazy Loading**: Components load only when needed

## Browser Support

- **Modern Browsers**: Full support for all features
- **Touch Devices**: Drag & drop works on mobile
- **Keyboard Navigation**: Full accessibility support
- **Progressive Enhancement**: Graceful degradation for older browsers

## Development

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Next.js 15

### Setup
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint
```

### Key Dependencies
- **@dnd-kit**: Drag & drop functionality
- **react-intersection-observer**: Infinite scroll
- **Shadcn/ui**: Component library
- **Tailwind CSS**: Styling

## Customization

### Styling
- Modify Tailwind classes in component files
- Update Shadcn component variants
- Customize color schemes in `tailwind.config.js`

### Functionality
- Add new task properties in the schema
- Extend drag & drop behavior
- Implement additional search filters
- Add task categories or tags

### Integration
- Connect to different backend APIs
- Add authentication flows
- Implement real-time updates
- Add offline support

## Best Practices

1. **Component Design**: Each component has a single responsibility
2. **State Management**: Local state for UI, server state for data
3. **Error Handling**: Graceful fallbacks and user feedback
4. **Performance**: Optimistic updates and efficient rendering
5. **Accessibility**: Keyboard navigation and screen reader support
6. **Testing**: Components are designed for easy testing

## Troubleshooting

### Common Issues
- **Drag & Drop Not Working**: Check @dnd-kit installation
- **Search Not Filtering**: Verify API endpoint configuration
- **Tasks Not Loading**: Check authentication and API permissions
- **Build Errors**: Ensure all dependencies are installed

### Debug Mode
- Check browser console for errors
- Verify API responses in Network tab
- Test individual components in isolation
- Check TypeScript compilation errors

## Contributing

1. Follow the existing code structure
2. Maintain component modularity
3. Add proper TypeScript types
4. Include error handling
5. Test on multiple devices
6. Update documentation

## License

This project follows the same license as the main repository.



