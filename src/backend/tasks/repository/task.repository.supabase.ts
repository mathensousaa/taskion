import { injectable } from 'tsyringe'
import type { ITaskRepository } from '@/backend/tasks/repository/task.repository'
import {
	type Cursor,
	type PaginatedTasksResponse,
	type PaginationQuery,
	type Task,
	type TaskDbInsert,
	TaskSchema,
	type TasksReorderInput,
	type TaskUpdateInput,
} from '@/backend/tasks/validation/task.creation.schema'
import { supabase } from '@/lib/supabase/server'

@injectable()
export class TaskRepositorySupabase implements ITaskRepository {
	async create(task: TaskDbInsert): Promise<Task> {
		const { data, error } = await supabase.from('tasks').insert(task).select().single()

		if (error) throw error

		return TaskSchema.parse(data)
	}

	async findAll(): Promise<Task[]> {
		const { data, error } = await supabase
			.from('tasks')
			.select('*')
			.is('deleted_at', null)
			.order('order', { ascending: true })
			.order('created_at', { ascending: true })
			.order('id', { ascending: true })

		if (error) throw error

		return data.map((task) => TaskSchema.parse(task))
	}

	async findAllByUserId(userId: string): Promise<Task[]> {
		const { data, error } = await supabase
			.from('tasks')
			.select('*')
			.eq('user_id', userId)
			.is('deleted_at', null)
			.order('order', { ascending: true })
			.order('created_at', { ascending: true })
			.order('id', { ascending: true })

		if (error) throw error

		return data.map((task) => TaskSchema.parse(task))
	}

	async findAllByUserIdPaginated(
		userId: string,
		pagination: PaginationQuery,
	): Promise<PaginatedTasksResponse> {
		const { limit, cursor } = pagination

		let query = supabase
			.from('tasks')
			.select('*')
			.eq('user_id', userId)
			.is('deleted_at', null)
			.order('order', { ascending: true })
			.order('created_at', { ascending: true })
			.order('id', { ascending: true })
			.limit(limit + 1) // Get one extra to determine if there are more results

		// Apply cursor if provided
		if (cursor) {
			query = query.or(
				`order.gt.${cursor.order},and(order.eq.${cursor.order},created_at.gt.${cursor.created_at}),and(order.eq.${cursor.order},created_at.eq.${cursor.created_at},id.gt.${cursor.id})`,
			)
		}

		const { data, error } = await query

		if (error) throw error

		const tasks = data.map((task) => TaskSchema.parse(task))
		const hasMore = tasks.length > limit
		const resultTasks = hasMore ? tasks.slice(0, limit) : tasks

		// Calculate next cursor
		let nextCursor: Cursor | undefined
		if (hasMore && resultTasks.length > 0) {
			const lastTask = resultTasks[resultTasks.length - 1]
			nextCursor = {
				order: lastTask.order,
				created_at: lastTask.created_at,
				id: lastTask.id,
			}
		}

		return {
			tasks: resultTasks,
			nextCursor,
			hasMore,
		}
	}

	async findById(id: string): Promise<Task | null> {
		const { data, error } = await supabase
			.from('tasks')
			.select('*')
			.eq('id', id)
			.is('deleted_at', null)
			.single()

		if (error) {
			if (error.code === 'PGRST116') return null
			throw error
		}

		return TaskSchema.parse(data)
	}

	async update(id: string, task: TaskUpdateInput): Promise<Task> {
		const updateData = {
			...task,
			updated_at: new Date().toISOString(),
		}

		const { data, error } = await supabase
			.from('tasks')
			.update(updateData)
			.eq('id', id)
			.select()
			.single()

		if (error) throw error

		return TaskSchema.parse(data)
	}

	async delete(id: string): Promise<void> {
		const { error } = await supabase
			.from('tasks')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id)

		if (error) throw error
	}

	async reorderTasks(userId: string, reorderData: TasksReorderInput): Promise<Task[]> {
		// Start a transaction-like operation
		const { data: existingTasks, error: fetchError } = await supabase
			.from('tasks')
			.select('id, order')
			.eq('user_id', userId)
			.is('deleted_at', null)
			.order('order', { ascending: true })

		if (fetchError) throw fetchError

		// Create a map of current orders
		const currentOrders = new Map(existingTasks.map((task) => [task.id, task.order]))

		// Calculate new orders for all affected tasks
		const updates: Array<{ id: string; order: number }> = []
		const sortedReorderData = [...reorderData].sort((a, b) => a.newOrder - b.newOrder)

		// First, update the explicitly reordered tasks
		for (const reorderItem of sortedReorderData) {
			updates.push({
				id: reorderItem.taskId,
				order: reorderItem.newOrder,
			})
		}

		// Then, adjust other tasks to maintain proper ordering
		let nextOrder = 0
		for (const task of existingTasks) {
			if (!reorderData.some((r) => r.taskId === task.id)) {
				// Skip tasks that were explicitly reordered
				while (reorderData.some((r) => r.newOrder === nextOrder)) {
					nextOrder++
				}
				if (task.order !== nextOrder) {
					updates.push({
						id: task.id,
						order: nextOrder,
					})
				}
				nextOrder++
			}
		}

		const { data: updatedTasks, error: updateError } = await supabase
			.from('tasks')
			.update(
				updates.map((update) => ({
					order: update.order,
					updated_at: new Date().toISOString(),
				})),
			)
			.in(
				'id',
				updates.map((update) => update.id),
			)
			.select()

		if (updateError) throw updateError

		// Return the updated tasks in the correct order
		const { data: finalTasks, error: finalError } = await supabase
			.from('tasks')
			.select('*')
			.eq('user_id', userId)
			.is('deleted_at', null)
			.order('order', { ascending: true })
			.order('created_at', { ascending: true })
			.order('id', { ascending: true })

		if (finalError) throw finalError

		return finalTasks.map((task) => TaskSchema.parse(task))
	}

	async getMaxOrderByUserId(userId: string): Promise<number> {
		const { data, error } = await supabase
			.from('tasks')
			.select('order')
			.eq('user_id', userId)
			.is('deleted_at', null)
			.order('order', { ascending: false })
			.limit(1)
			.single()

		if (error) {
			if (error.code === 'PGRST116') return 0
			throw error
		}

		return data.order
	}
}
