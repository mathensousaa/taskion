import { NextResponse } from 'next/server'
import { inject, injectable } from 'tsyringe'
import { AuthenticatedUser } from '@/backend/common/decorators'
import { ErrorHandler } from '@/backend/common/errors/error-handler'
import { UserService } from '@/backend/users/services/user.service'
import type { User } from '@/backend/users/validation/user.schema'
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

	@AuthenticatedUser()
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

	@AuthenticatedUser()
	async getById(authenticatedUser: User, id: string) {
		try {
			const user = await this.service.getUserById(id)

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

	@AuthenticatedUser()
	async update(authenticatedUser: User, id: string, req: Request) {
		try {
			const body = await req.json()
			const data = UserUpdateSchema.parse(body)

			const user = await this.service.updateUser(id, data)

			return NextResponse.json(
				{ success: true, message: 'User successfully updated', data: user },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'UserController.update')
		}
	}

	@AuthenticatedUser()
	async delete(authenticatedUser: User, id: string) {
		try {
			await this.service.deleteUser(id)

			return NextResponse.json(
				{ success: true, message: 'User successfully deleted' },
				{ status: 200 },
			)
		} catch (error) {
			return ErrorHandler.handle(error, 'UserController.delete')
		}
	}
}
