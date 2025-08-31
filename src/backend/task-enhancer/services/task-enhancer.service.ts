import { inject, injectable } from 'tsyringe'
import type { Task } from '@/modules'
import { N8nTaskEnhancerAdapter } from '../adapters/n8n-task-enhancer.adapter'

@injectable()
export class TaskEnhancerService {
	constructor(
		@inject(N8nTaskEnhancerAdapter) private readonly n8nTaskEnhancerAdapter: N8nTaskEnhancerAdapter,
	) {}

	async enhanceTask(task: Task): Promise<Task> {
		const { data } = await this.n8nTaskEnhancerAdapter.enhanceTask(task)
		return data
	}
}
