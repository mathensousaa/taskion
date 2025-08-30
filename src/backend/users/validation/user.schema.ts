import z from 'zod'

export const UserCreationSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
})

export type UserCreationInput = z.infer<typeof UserCreationSchema>

export const UserUpdateSchema = z.object({
	name: z.string().min(1).optional(),
	email: z.email().optional(),
})

export type UserUpdateInput = z.infer<typeof UserUpdateSchema>

export const UserSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	email: z.string(),
	created_at: z.string(),
})

export type User = z.infer<typeof UserSchema>
