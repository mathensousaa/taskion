import { NextResponse } from 'next/server'
import { inject, injectable } from 'tsyringe'
import { z } from 'zod'
import { IsAuthenticated } from '@/backend/common/decorators'
import { ErrorHandler } from '@/backend/common/errors/error-handler'
import { validateIdParam } from '@/backend/common/validation/common.schema'
import { UserService } from '@/backend/users/services/user.service'
import { UserCreationSchema, UserUpdateSchema } from '@/backend/users/validation/user.schema'

@injectable()
export class UserController {
	constructor(@inject(UserService) private readonly service: UserService) {}

	// Public endpoint for user registration
	async create(req: Request) {
		try {
			const body = await req.json()
			const data = UserCreationSchema.parse(body)

			const user = await this.service.createUser(data)

			return NextResponse.json(
				{ success: true, message: 'User successfully created', data: user },
				{ status: 201 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'UserController.create')
		}
	}

	@IsAuthenticated()
	async getAll() {
		try {
			const users = await this.service.getAllUsers()

			return NextResponse.json(
				{ success: true, message: 'Users retrieved successfully', data: users },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'UserController.getAll')
		}
	}

	@IsAuthenticated()
	async getById(id: string) {
		try {
			// Validate ID parameter before calling service
			const validatedId = validateIdParam(id)

			const user = await this.service.getUserById(validatedId)

			if (!user) {
				return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
			}

			return NextResponse.json(
				{ success: true, message: 'User retrieved successfully', data: user },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'UserController.getById')
		}
	}

	@IsAuthenticated({ allowApiKeyOnly: true })
	async getByEmail(email: string, _req: Request) {
		try {
			const emailSchema = z.email()
			const validatedEmail = emailSchema.parse(email)

			const user = await this.service.getUserByEmail(validatedEmail)

			if (!user) {
				return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
			}

			return NextResponse.json(
				{ success: true, message: 'User retrieved successfully', data: user },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'UserController.getByEmail')
		}
	}

	@IsAuthenticated()
	async update(id: string, req: Request) {
		try {
			// Validate ID parameter before calling service
			const validatedId = validateIdParam(id)

			const body = await req.json()
			const data = UserUpdateSchema.parse(body)

			const user = await this.service.updateUser(validatedId, data)

			return NextResponse.json(
				{ success: true, message: 'User successfully updated', data: user },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'UserController.update')
		}
	}

	@IsAuthenticated()
	async delete(id: string) {
		try {
			// Validate ID parameter before calling service
			const validatedId = validateIdParam(id)

			await this.service.deleteUser(validatedId)

			return NextResponse.json(
				{ success: true, message: 'User successfully deleted' },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'UserController.delete')
		}
	}
}
