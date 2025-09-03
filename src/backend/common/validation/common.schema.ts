import z from 'zod'
import { CursorSchema } from '@/backend/tasks/validation/task.schema'

// Common parameter validation schemas

export const IdParamSchema = z.object({
	id: z.uuid('Invalid ID format. Must be a valid UUID.'),
})

export const SlugParamSchema = z.object({
	slug: z
		.string()
		.min(1, 'Slug is required')
		.max(50, 'Slug must be 50 characters or less')
		.regex(
			/^[a-z0-9_-]+$/,
			'Slug must contain only lowercase letters, numbers, underscores, and hyphens',
		),
})

export const PaginationQuerySchema = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(20),
	cursor: CursorSchema.optional(),
	page: z.coerce.number().int().min(1).optional(),
})

export const TaskFiltersSchema = z.object({
	status: z.string().min(1).optional().nullable(),
})

export type TaskFilters = z.infer<typeof TaskFiltersSchema>

// Repository-level filters (internal use)
export const TaskRepositoryFiltersSchema = z.object({
	status_id: z.uuid().optional().nullable(),
})

export type TaskRepositoryFilters = z.infer<typeof TaskRepositoryFiltersSchema>

export type IdParam = z.infer<typeof IdParamSchema>
export type SlugParam = z.infer<typeof SlugParamSchema>
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>

export const validateIdParam = (id: string): string => {
	const result = IdParamSchema.parse({ id })

	return result.id
}

export const validateSlugParam = (slug: string): string => {
	const result = SlugParamSchema.parse({ slug })

	return result.slug
}

export const validatePaginationQuery = (query: Record<string, string | string[] | undefined>) => {
	return PaginationQuerySchema.parse(query)
}
