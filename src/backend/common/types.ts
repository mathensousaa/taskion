/**
 * Common types and interfaces used across the backend
 */

import type { Cursor } from '@/backend/tasks/validation/task.schema'

/**
 * Generic API response interface
 */
export interface ApiResponse<TData> {
	success: boolean
	message: string
	data: TData
}

/**
 * Generic Paginated API response interface
 */
export interface PaginatedApiResponse<TData> {
	success: boolean
	message: string
	data: TData[]
	nextCursor?: Cursor
	hasMore: boolean
}

/**
 * Generic Paginated response interface
 */
export interface Paginated<TData> {
	data: TData[]
	nextCursor?: Cursor
	hasMore: boolean
}
