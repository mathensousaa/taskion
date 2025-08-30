import z from 'zod'

export const LoginSchema = z.object({
	email: z.email('Invalid email format'),
})

export type LoginInput = z.infer<typeof LoginSchema>

export const AuthResponseSchema = z.object({
	success: z.boolean(),
	message: z.string().optional(),
	user: z
		.object({
			id: z.string(),
			email: z.string(),
			name: z.string(),
		})
		.optional(),
})

export type AuthResponse = z.infer<typeof AuthResponseSchema>
