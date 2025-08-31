import { inject, injectable } from 'tsyringe'
import type { ApiResponse } from '@/backend/common/types'
import { N8N_WEBHOOK_AUTH_HEADER, N8N_WEBHOOK_PATH, N8N_WEBHOOK_TOKEN } from '@/configs/environment'
import type { FetchClient } from '@/lib/fetch-client'
import type { Task } from '@/modules'

@injectable()
export class N8nTaskEnhancerAdapter {
	constructor(@inject('N8nClient') private readonly n8n: FetchClient) {}

	async enhanceTask(task: Task): Promise<ApiResponse<Task>> {
		const response = await this.n8n.request<[ApiResponse<Task>]>(
			`/${N8N_WEBHOOK_PATH}/task-enhancer`,
			{
				method: 'POST',
				headers: {
					[N8N_WEBHOOK_AUTH_HEADER as string]: N8N_WEBHOOK_TOKEN as string,
				},
				body: JSON.stringify(task),
			},
		)

		return response[0]
	}
}
