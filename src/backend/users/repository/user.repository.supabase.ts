import { injectable } from 'tsyringe'
import type { IUserRepository } from '@/backend/users/repository/user.repository'
import {
	type User,
	type UserCreationInput,
	UserSchema,
	type UserUpdateInput,
} from '@/backend/users/validation/user.schema'
import { supabase } from '@/lib/supabase/server'

@injectable()
export class UserRepositorySupabase implements IUserRepository {
	async create(user: UserCreationInput): Promise<User> {
		const { data, error } = await supabase.from('users').insert(user).select().single()

		if (error) throw error

		return UserSchema.parse(data)
	}

	async findAll(): Promise<User[]> {
		const { data, error } = await supabase
			.from('users')
			.select('*')
			.order('created_at', { ascending: false })

		if (error) throw error

		return data.map((user) => UserSchema.parse(user))
	}

	async findById(id: string): Promise<User | null> {
		const { data, error } = await supabase.from('users').select('*').eq('id', id).single()

		if (error) {
			if (error.code === 'PGRST116') return null
			throw error
		}

		return UserSchema.parse(data)
	}

	async findByEmail(email: string): Promise<User | null> {
		const { data, error } = await supabase.from('users').select('*').eq('email', email).single()

		if (error) {
			if (error.code === 'PGRST116') return null
			throw error
		}

		return UserSchema.parse(data)
	}

	async update(id: string, user: UserUpdateInput): Promise<User> {
		const { data, error } = await supabase.from('users').update(user).eq('id', id).select().single()

		if (error) throw error

		return UserSchema.parse(data)
	}

	async delete(id: string): Promise<void> {
		const { error } = await supabase.from('users').delete().eq('id', id)

		if (error) throw error
	}
}
