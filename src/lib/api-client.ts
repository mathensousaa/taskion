import { z } from 'zod'

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public details?: any,
	) {
		super(message)
		this.name = 'ApiError'
	}
}

export async function apiRequest<T>(
	url: string,
	options: RequestInit = {},
	schema?: z.ZodSchema<T>,
): Promise<T> {
	try {
		const response = await fetch(url, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			throw new ApiError(
				errorData.message || `HTTP error! status: ${response.status}`,
				response.status,
				errorData,
			)
		}

		const data = await response.json()

		if (schema) {
			return schema.parse(data)
		}

		return data
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}

		if (error instanceof z.ZodError) {
			throw new ApiError('Invalid response format', 422, error.errors)
		}

		throw new ApiError(error instanceof Error ? error.message : 'Unknown error occurred', 500)
	}
}

export const BASE_URL = process.env.API_URL || 'http://localhost:3000/api'
