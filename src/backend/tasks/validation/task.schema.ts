import z from 'zod'

export const TaskCreationSchema = z.object({
	title: z
		.string()
		.min(1)
		.refine((title) => title.trim().split(/\s+/).length >= 3, {
			message: 'Please provide more details. Enter at least 3 words',
		}),
	description: z.string().optional(),
	status_id: z.uuid().optional(),
})

export type TaskCreationInput = z.infer<typeof TaskCreationSchema>

export const TaskUpdateSchema = z.object({
	title: z
		.string()
		.min(1)
		.refine((title) => title.trim().split(/\s+/).length >= 3, {
			message: 'Please provide more details. Enter at least 3 words',
		})
		.optional(),
	description: z.string().optional(),
	status_id: z.uuid().optional(),
	order: z.number().int().min(0).optional(),
})

export type TaskUpdateInput = z.infer<typeof TaskUpdateSchema>

export const TaskDbInsertSchema = z.object({
	title: z
		.string()
		.min(1)
		.refine((title) => title.trim().split(/\s+/).length >= 3, {
			message: 'Please provide more details. Enter at least 3 words',
		}),
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

// Reorder types
export const TaskReorderSchema = z.object({
	taskId: z.uuid(),
	newOrder: z.number().int().min(0),
})

export type TaskReorderInput = z.infer<typeof TaskReorderSchema>

export const TasksReorderSchema = z.array(TaskReorderSchema)

export type TasksReorderInput = z.infer<typeof TasksReorderSchema>
