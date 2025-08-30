import { cookies } from 'next/headers'
import { inject, injectable } from 'tsyringe'
import type { LoginInput } from '@/backend/auth/validation/auth.schema'
import { NotFoundError } from '@/backend/common/errors/not-found-error'
import { UnauthorizedError } from '@/backend/common/errors/unauthorized-error'
import { UserService } from '@/backend/users/services/user.service'

@injectable()
export class AuthService {
	constructor(@inject(UserService) private readonly userService: UserService) {}

	async login(input: LoginInput) {
		const user = await this.userService.getUserByEmail(input.email)

		if (!user) {
			throw new NotFoundError('User not found')
		}

		const cookieStore = await cookies()
		cookieStore.set('session', input.email, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/',
		})

		return {
			success: true,
			message: 'Login successful',
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		}
	}

	async validateSession() {
		const cookieStore = await cookies()
		const session = cookieStore.get('session')

		if (!session?.value) {
			throw new UnauthorizedError('No active session')
		}
		const user = await this.userService.getUserByEmail(session.value)

		if (!user) {
			throw new UnauthorizedError('Invalid session')
		}

		return user
	}

	async logout() {
		const cookieStore = await cookies()
		cookieStore.delete('session')
	}
}
