import z from 'zod'
import { CursorSchema } from '@/backend/tasks/validation/task.schema'

// Common parameter validation schemas

export const IdParamSchema = z.object({
	id: z.uuid('Invalid ID format. Must be a valid UUID.'),
})

export const PaginationQuerySchema = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(20),
	cursor: CursorSchema.optional(),
	page: z.coerce.number().int().min(1).optional(),
})

export type IdParam = z.infer<typeof IdParamSchema>
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>

export const validateIdParam = (id: string): string => {
	const result = IdParamSchema.parse({ id })

	return result.id
}

export const validatePaginationQuery = (query: Record<string, string | string[] | undefined>) => {
	return PaginationQuerySchema.parse(query)
}
