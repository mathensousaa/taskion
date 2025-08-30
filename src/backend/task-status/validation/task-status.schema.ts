import z from 'zod'

export const TaskStatusCreationSchema = z.object({
	name: z.string().min(1),
	slug: z.string().min(1),
	color: z.string().min(1),
	icon: z.string().min(1),
	order: z.number().int().min(0),
})

export type TaskStatusCreationInput = z.infer<typeof TaskStatusCreationSchema>

export const TaskStatusUpdateSchema = z.object({
	name: z.string().min(1).optional(),
	slug: z.string().min(1).optional(),
	color: z.string().min(1).optional(),
	icon: z.string().min(1).optional(),
	order: z.number().int().min(0).optional(),
})

export type TaskStatusUpdateInput = z.infer<typeof TaskStatusUpdateSchema>

export const TaskStatusSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	slug: z.string(),
	color: z.string(),
	icon: z.string(),
	order: z.number(),
	created_at: z.string(),
})

export type TaskStatus = z.infer<typeof TaskStatusSchema>
