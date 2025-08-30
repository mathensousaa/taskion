import type { User, UserCreationInput, UserUpdateInput } from '@/backend/users/validation/user.schema'

export interface IUserRepository {
	create(user: UserCreationInput): Promise<User>
	findAll(): Promise<User[]>
	findById(id: string): Promise<User | null>
	findByEmail(email: string): Promise<User | null>
	update(id: string, user: UserUpdateInput): Promise<User>
	delete(id: string): Promise<void>
}
