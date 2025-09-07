# Task Filters with nuqs

This directory contains hooks for managing task filters using nuqs for URL state management.

## Files

- `use-task-filters.ts` - Basic task filters implementation with status filter
- `use-task-filters-extended.ts` - Extended example showing how to add more filter types

## Usage

### Basic Usage

```tsx
import { useTaskFilters } from '@/modules/tasks/hooks/use-task-filters'

function TaskFilterComponent() {
  const { status, setStatus, clearFilters } = useTaskFilters()

  return (
    <div>
      <select value={status || 'all'} onChange={(e) => setStatus(e.target.value === 'all' ? undefined : e.target.value)}>
        <option value="all">All Statuses</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button onClick={clearFilters}>Clear Filters</button>
    </div>
  )
}
```

### URL State Management

The filters are automatically synchronized with the URL query parameters:

- `?status=todo` - Shows only tasks with "todo" status
- `?status=in-progress` - Shows only tasks with "in-progress" status
- No status parameter - Shows all tasks

### Adding New Filters

To add new filters, follow the pattern in `use-task-filters-extended.ts`:

1. Add the filter to the interface
2. Add the corresponding nuqs parser
3. Add the setter function
4. Update the clearFilters function

Example for adding a priority filter:

```tsx
const [priority, setPriority] = useQueryState('priority', parseAsString)

return {
  // ... existing filters
  priority: priority || undefined,
  setPriority: (newPriority: string | undefined) => {
    setPriority(newPriority || null)
  },
  clearFilters: () => {
    setStatus(null)
    setPriority(null) // Add new filter to clear
  },
}
```

## Benefits

- **URL State Management**: Filters are persisted in the URL, making them shareable and bookmarkable
- **Browser Navigation**: Back/forward buttons work with filters
- **Type Safety**: Full TypeScript support with proper types
- **Performance**: Only re-renders when filters actually change
- **Extensible**: Easy to add new filter types following the established pattern
