import { inject, injectable } from 'tsyringe'
import { AlreadyExistsError } from '@/backend/common/errors/already-exists-error'
import type { IUserRepository } from '@/backend/users/repository/user.repository'
import type { UserCreationInput, UserUpdateInput } from '@/backend/users/validation/user.schema'

@injectable()
export class UserService {
	constructor(@inject('IUserRepository') private readonly repository: IUserRepository) {}

	async createUser(input: UserCreationInput) {
		// Check if user with email already exists
		const existingUser = await this.repository.findByEmail(input.email)
		if (existingUser) {
			throw new AlreadyExistsError('User with this email already exists')
		}

		return await this.repository.create(input)
	}

	async getAllUsers() {
		return await this.repository.findAll()
	}

	async getUserById(id: string) {
		return await this.repository.findById(id)
	}

	async getUserByEmail(email: string) {
		return await this.repository.findByEmail(email)
	}

	async updateUser(id: string, input: UserUpdateInput) {
		// If updating email, check if it's already taken by another user
		if (input.email) {
			const existingUser = await this.repository.findByEmail(input.email)
			if (existingUser && existingUser.id !== id) {
				throw new AlreadyExistsError('Email is already taken by another user')
			}
		}

		return await this.repository.update(id, input)
	}

	async deleteUser(id: string) {
		await this.repository.delete(id)
	}
}
