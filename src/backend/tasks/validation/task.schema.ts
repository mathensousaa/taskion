import { LexoRank } from 'lexorank'
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
	order: z.string().optional(),
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
	order: z.string().default(() => LexoRank.middle().toString()),
})

export type TaskDbInsert = z.infer<typeof TaskDbInsertSchema>

export const TaskSchema = z.object({
	id: z.uuid(),
	title: z.string(),
	description: z.string().nullable(),
	status_id: z.uuid(),
	user_id: z.uuid(),
	order: z.string(),
	created_at: z.string(),
	deleted_at: z.string().nullable(),
	updated_at: z.string().nullable(),
})

export type Task = z.infer<typeof TaskSchema>

// Cursor-based pagination types
export const CursorSchema = z.object({
	order: z.string(),
	created_at: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: 'created_at must be a valid ISO timestamp string',
	}),
	id: z.uuid(),
})

export type Cursor = z.infer<typeof CursorSchema>

// Reorder types
export const TaskReorderSchema = z.object({
	taskId: z.uuid(),
	previousTaskId: z.uuid().nullable(),
	nextTaskId: z.uuid().nullable(),
})

export type TaskReorderInput = z.infer<typeof TaskReorderSchema>

export const TasksReorderSchema = z.array(TaskReorderSchema)

export type TasksReorderInput = z.infer<typeof TasksReorderSchema>

// Task status update by slug schema
export const TaskStatusUpdateBySlugSchema = z.object({
	status_slug: z.string().min(1, 'Status slug is required'),
})

export type TaskStatusUpdateBySlugInput = z.infer<typeof TaskStatusUpdateBySlugSchema>
