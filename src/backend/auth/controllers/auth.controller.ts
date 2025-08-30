import { NextResponse } from 'next/server'
import { inject, injectable } from 'tsyringe'
import { AuthService } from '@/backend/auth/services/auth.service'
import { LoginSchema } from '@/backend/auth/validation/auth.schema'
import { ErrorHandler } from '@/backend/common/errors/error-handler'

@injectable()
export class AuthController {
	constructor(@inject(AuthService) private readonly service: AuthService) {}

	async login(req: Request) {
		try {
			const body = await req.json()
			const data = LoginSchema.parse(body)

			const result = await this.service.login(data)

			return NextResponse.json(result, { status: 200 })
		} catch (error) {
			return ErrorHandler.handle(error, 'AuthController.login')
		}
	}

	async logout() {
		try {
			await this.service.logout()

			return NextResponse.json({ success: true, message: 'Logout successful' }, { status: 200 })
		} catch (error) {
			return ErrorHandler.handle(error, 'AuthController.logout')
		}
	}

	async getCurrentUser() {
		try {
			const user = await this.service.validateSession()

			return NextResponse.json(
				{
					success: true,
					message: 'User session validated',
					data: {
						id: user.id,
						email: user.email,
						name: user.name,
					},
				},
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'AuthController.getCurrentUser')
		}
	}
}
