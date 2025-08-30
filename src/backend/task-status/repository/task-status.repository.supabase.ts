import { injectable } from 'tsyringe'
import type { ITaskStatusRepository } from '@/backend/task-status/repository/task-status.repository'
import {
	type TaskStatus,
	type TaskStatusCreationInput,
	TaskStatusSchema,
	type TaskStatusUpdateInput,
} from '@/backend/task-status/validation/task-status.schema'
import { supabase } from '@/lib/supabase/server'

@injectable()
export class TaskStatusRepositorySupabase implements ITaskStatusRepository {
	async create(taskStatus: TaskStatusCreationInput): Promise<TaskStatus> {
		const { data, error } = await supabase.from('task_status').insert(taskStatus).select().single()

		if (error) throw error

		return TaskStatusSchema.parse(data)
	}

	async findAll(): Promise<TaskStatus[]> {
		const { data, error } = await supabase
			.from('task_status')
			.select('*')
			.order('order', { ascending: true })

		if (error) throw error

		return data.map((taskStatus) => TaskStatusSchema.parse(taskStatus))
	}

	async findById(id: string): Promise<TaskStatus | null> {
		const { data, error } = await supabase.from('task_status').select('*').eq('id', id).single()

		if (error) {
			if (error.code === 'PGRST116') return null
			throw error
		}

		return TaskStatusSchema.parse(data)
	}

	async findBySlug(slug: string): Promise<TaskStatus | null> {
		const { data, error } = await supabase.from('task_status').select('*').eq('slug', slug).single()

		if (error) {
			if (error.code === 'PGRST116') return null
			throw error
		}

		return TaskStatusSchema.parse(data)
	}

	async update(id: string, taskStatus: TaskStatusUpdateInput): Promise<TaskStatus> {
		const { data, error } = await supabase
			.from('task_status')
			.update(taskStatus)
			.eq('id', id)
			.select()
			.single()

		if (error) throw error

		return TaskStatusSchema.parse(data)
	}

	async delete(id: string): Promise<void> {
		const { error } = await supabase.from('task_status').delete().eq('id', id)

		if (error) throw error
	}
}
