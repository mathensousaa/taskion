import { inject, injectable } from 'tsyringe'
import type { ITaskStatusRepository } from '@/backend/task-status/repository/task-status.repository'
import type {
	TaskStatusCreationInput,
	TaskStatusUpdateInput,
} from '@/backend/task-status/validation/task-status.schema'

@injectable()
export class TaskStatusService {
	constructor(
		@inject('ITaskStatusRepository') private readonly repository: ITaskStatusRepository,
	) {}

	async createTaskStatus(input: TaskStatusCreationInput) {
		return await this.repository.create(input)
	}

	async getAllTaskStatuses() {
		return await this.repository.findAll()
	}

	async getTaskStatusById(id: string) {
		return await this.repository.findById(id)
	}

	async getTaskStatusBySlug(slug: string) {
		return await this.repository.findBySlug(slug)
	}

	async updateTaskStatus(id: string, input: TaskStatusUpdateInput) {
		return await this.repository.update(id, input)
	}

	async deleteTaskStatus(id: string) {
		await this.repository.delete(id)
	}

	async getDefaultStatusId(): Promise<string> {
		const taskStatus = await this.repository.findBySlug('not_started')
		if (!taskStatus) throw new Error('Default task status not found')
		return taskStatus.id
	}
}
