import z from 'zod'

export const TaskCreationSchema = z.object({
	title: z.string().min(1),
	description: z.string().optional(),
	status_id: z.uuid().optional(),
})

export type TaskCreationInput = z.infer<typeof TaskCreationSchema>

export const TaskUpdateSchema = z.object({
	title: z.string().min(1).optional(),
	description: z.string().optional(),
	status_id: z.uuid().optional(),
	order: z.number().int().min(0).optional(),
})

export type TaskUpdateInput = z.infer<typeof TaskUpdateSchema>

export const TaskDbInsertSchema = z.object({
	title: z.string().min(1),
	description: z.string().nullable(),
	user_id: z.uuid(),
	status_id: z.uuid(),
	order: z.number().int().min(0).default(0),
})

export type TaskDbInsert = z.infer<typeof TaskDbInsertSchema>

export const TaskSchema = z.object({
	id: z.uuid(),
	title: z.string(),
	description: z.string().nullable(),
	status_id: z.uuid(),
	user_id: z.uuid(),
	order: z.number().int().min(0),
	created_at: z.string(),
	deleted_at: z.string().nullable(),
	updated_at: z.string().nullable(),
})

export type Task = z.infer<typeof TaskSchema>

// Cursor-based pagination types
export const CursorSchema = z.object({
	order: z.number().int().min(0),
	created_at: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: 'created_at must be a valid ISO timestamp string',
	}),
	id: z.uuid(),
})

export type Cursor = z.infer<typeof CursorSchema>

export const PaginationQuerySchema = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(20),
	cursor: CursorSchema.optional(),
})

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>

export const PaginatedTasksResponseSchema = z.object({
	data: z.array(TaskSchema),
	nextCursor: CursorSchema.optional(),
	hasMore: z.boolean(),
})

export type PaginatedTasksResponse = z.infer<typeof PaginatedTasksResponseSchema>

// Reorder types
export const TaskReorderSchema = z.object({
	taskId: z.uuid(),
	newOrder: z.number().int().min(0),
})

export type TaskReorderInput = z.infer<typeof TaskReorderSchema>

export const TasksReorderSchema = z.array(TaskReorderSchema)

export type TasksReorderInput = z.infer<typeof TasksReorderSchema>
