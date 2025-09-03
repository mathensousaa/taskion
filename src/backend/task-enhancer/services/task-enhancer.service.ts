import { inject, injectable } from 'tsyringe'
import type { Task } from '@/modules'
import { N8nTaskEnhancerAdapter } from '../adapters/n8n-task-enhancer.adapter'

@injectable()
export class TaskEnhancerService {
	constructor(
		@inject(N8nTaskEnhancerAdapter) private readonly n8nTaskEnhancerAdapter: N8nTaskEnhancerAdapter,
	) {}

	async enhanceTask(task: Task): Promise<Task> {
		try {
			// Add timeout to prevent hanging
			const timeoutPromise = new Promise<never>((_, reject) => {
				setTimeout(() => reject(new Error('Task enhancement timeout')), 10000) // 10 second timeout
			})

			const enhancementPromise = this.n8nTaskEnhancerAdapter.enhanceTask(task)

			const { data } = await Promise.race([enhancementPromise, timeoutPromise])
			return data
		} catch (error) {
			// Log the error but don't fail the task creation
			console.warn('Task enhancement failed, returning original task:', error)
			return task
		}
	}
}
