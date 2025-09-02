import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ApiResponse } from '@/backend/common/types'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// Cursor utilities for pagination
export function encodeCursor(cursor: { order: number; created_at: string; id: string }): string {
	return btoa(JSON.stringify(cursor))
}

export function decodeCursor(encodedCursor: string): {
	order: number
	created_at: string
	id: string
} {
	try {
		return JSON.parse(atob(encodedCursor))
	} catch (error) {
		throw new Error('Invalid cursor format')
	}
}

// Task ordering utilities
export function calculateNewOrder(
	currentOrder: number,
	targetOrder: number,
	totalTasks: number,
): number {
	return Math.max(0, Math.min(targetOrder, totalTasks))
}

export function generateOrderSequence(startOrder: number, count: number): number[] {
	return Array.from({ length: count }, (_, i) => startOrder + i)
}

interface parseResponseDataOptions {
	useRawData: boolean
}

export function parseResponseData<T>(
	response: ApiResponse<T> | any,
	options: parseResponseDataOptions = { useRawData: false },
): T {
	if (typeof response.data === 'object' && 'data' in response.data && !response.data?.ct) {
		return options.useRawData ? response.data : response.data.data
	}

	return response.data
}

export const objectToQueryParams = (params?: object): string[] =>
	params
		? (Object.entries(params) as [string, unknown][])
				.filter(([, v]) => !!v)
				.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
		: []

export const isQueryParam = (raw: unknown) => String(raw).split('=').length === 2

export const truncateToWords = (text: string, wordCount: number): string => {
	if (!text) return ''
	const words = text.trim().split(/\s+/)
	if (words.length <= wordCount) return text

	return words.slice(0, wordCount).join(' ') + '...'
}
