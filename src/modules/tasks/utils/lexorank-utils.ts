import { LexoRank } from 'lexorank'
import type { Task } from '@/backend/tasks/validation/task.schema'

export const LexoRankUtils = {
	generateOrderForNewTask(lastTask: Task | null): string {
		if (!lastTask || !lastTask.order) {
			return LexoRank.middle().toString()
		}

		// Generate next rank after the last task
		return LexoRank.parse(lastTask.order).genNext().toString()
	},

	generateOrderBetweenTasks(prevTask: Task | null, nextTask: Task | null): string {
		if (!prevTask && !nextTask) {
			return LexoRank.middle().toString()
		}

		if (!prevTask && nextTask && nextTask.order) {
			// Insert at the beginning
			return LexoRank.parse(nextTask.order).genPrev().toString()
		}

		if (prevTask && !nextTask && prevTask.order) {
			// Insert at the end
			return LexoRank.parse(prevTask.order).genNext().toString()
		}

		// Insert between two tasks
		if (prevTask?.order && nextTask?.order) {
			return LexoRank.parse(prevTask.order).between(LexoRank.parse(nextTask.order)).toString()
		}

		return LexoRank.middle().toString()
	},

	generateOrderForPosition(tasks: Task[], position: number): string {
		if (tasks.length === 0) {
			return LexoRank.middle().toString()
		}

		// Filter out tasks with null order and sort by order
		const validTasks = tasks.filter((task) => task.order !== null)
		if (validTasks.length === 0) {
			return LexoRank.middle().toString()
		}

		const sortedTasks = [...validTasks].sort((a, b) => a.order.localeCompare(b.order))

		if (position <= 0) {
			// Insert at the beginning
			return LexoRank.parse(sortedTasks[0].order).genPrev().toString()
		}

		if (position >= sortedTasks.length) {
			// Insert at the end
			return LexoRank.parse(sortedTasks[sortedTasks.length - 1].order)
				.genNext()
				.toString()
		}

		// Insert between tasks
		const prevTask = sortedTasks[position - 1]
		const nextTask = sortedTasks[position]
		return LexoRank.parse(prevTask.order).between(LexoRank.parse(nextTask.order)).toString()
	},

	// Helper function to calculate the new order when dragging a task to a new position
	calculateNewOrderForDrag(tasks: Task[], draggedTaskId: string, newIndex: number): string {
		// Filter out tasks with null order and sort by order
		const validTasks = tasks.filter((task) => task.order !== null)
		const sortedTasks = [...validTasks].sort((a, b) => a.order.localeCompare(b.order))

		// Remove the dragged task from the list
		const filteredTasks = sortedTasks.filter((task) => task.id !== draggedTaskId)

		// Calculate the new order based on the new position
		return this.generateOrderForPosition(filteredTasks, newIndex)
	},
}
