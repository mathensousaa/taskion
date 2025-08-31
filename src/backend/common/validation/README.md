# Common Validation Schemas

This directory contains shared validation schemas and utilities that can be reused across all controllers in the application.

## Overview

The validation system ensures that all input parameters (route params, query strings, and request bodies) are properly validated using Zod before reaching the service or repository layers. This prevents invalid data from causing database errors and provides clear error messages to clients.

## Available Schemas

### IdParamSchema
Validates UUID format for route parameters:
```typescript
import { IdParamSchema } from '@/backend/common/validation/common.schema'

const result = IdParamSchema.parse({ id: '123e4567-e89b-12d3-a456-426614174000' })
```

### PaginationQuerySchema
Validates pagination query parameters:
```typescript
import { PaginationQuerySchema } from '@/backend/common/validation/common.schema'

const result = PaginationQuerySchema.parse({
  limit: '20',
  page: '1',
  cursor: 'some-cursor'
})
```

## Helper Functions

### validateIdParam
Directly validates a UUID string:
```typescript
import { validateIdParam } from '@/backend/common/validation/common.schema'

try {
  const validatedId = validateIdParam(id)
  // Use validatedId in service calls
} catch (error) {
  // ErrorHandler will catch ZodError and return proper HTTP response
}
```

### validatePaginationQuery
Validates pagination query parameters:
```typescript
import { validatePaginationQuery } from '@/backend/common/validation/common.schema'

const pagination = validatePaginationQuery(queryParams)
```

## Usage in Controllers

All controllers should validate route parameters before calling services:

```typescript
@IsAuthenticated()
async getById(req: Request, id: string) {
  try {
    // Validate ID parameter before calling service
    const validatedId = validateIdParam(id)
    
    const task = await this.service.getTaskById(validatedId, req.user!)
    // ... rest of the method
  } catch (error) {
    return ErrorHandler.handle(error, 'TaskController.getById')
  }
}
```

## Error Handling

When validation fails, the `ErrorHandler` class automatically catches `ZodError` instances and returns appropriate HTTP 400 Bad Request responses with detailed error messages.

## Benefits

1. **Prevents Database Errors**: Invalid UUIDs are caught before reaching the database layer
2. **Consistent Error Messages**: All validation errors follow the same format
3. **Type Safety**: Zod provides runtime type checking with TypeScript integration
4. **Reusability**: Common schemas can be shared across controllers
5. **Clean Architecture**: Controllers handle validation, services assume valid data

## Adding New Validation Schemas

When adding new validation schemas:

1. Create the schema in the appropriate domain validation directory
2. If it's a common pattern, consider adding it to this common validation directory
3. Export the schema and its types
4. Add appropriate tests
5. Update this README if needed
