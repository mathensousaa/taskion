import { z } from 'zod'
import { ApiError } from '@/backend/common/errors/api-error'

type Interceptor<T> = (arg: T) => Promise<T> | T

export class FetchClient {
	private baseURL: string
	private requestInterceptors: Interceptor<RequestInit>[] = []
	private responseInterceptors: Interceptor<Response>[] = []

	constructor(baseURL: string) {
		this.baseURL = baseURL
	}

	// Permite adicionar interceptors
	addRequestInterceptor(interceptor: Interceptor<RequestInit>) {
		this.requestInterceptors.push(interceptor)
	}
	addResponseInterceptor(interceptor: Interceptor<Response>) {
		this.responseInterceptors.push(interceptor)
	}

	private async runInterceptors<T>(interceptors: Interceptor<T>[], value: T): Promise<T> {
		let result = value
		for (const interceptor of interceptors) {
			result = await interceptor(result)
		}
		return result
	}

	async request<T>(path: string, options: RequestInit = {}, schema?: z.ZodSchema<T>): Promise<T> {
		try {
			const finalOptions = await this.runInterceptors(this.requestInterceptors, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					...options.headers,
				},
			})

			const response = await fetch(`${this.baseURL}${path}`, finalOptions)

			const finalResponse = await this.runInterceptors(this.responseInterceptors, response)

			if (!finalResponse.ok) {
				const errorData = await finalResponse.json().catch(() => ({}))
				throw new ApiError(
					errorData.message || `HTTP error! status: ${finalResponse.status}`,
					finalResponse.status,
					errorData,
				)
			}

			const data = await finalResponse.json()

			if (schema) {
				return schema.parse(data)
			}

			return data
		} catch (error) {
			if (error instanceof ApiError) {
				throw error
			}

			if (error instanceof z.ZodError) {
				throw new ApiError('Invalid response format', 422, error.issues)
			}

			throw new ApiError('Unknown error', 500)
		}
	}
}
