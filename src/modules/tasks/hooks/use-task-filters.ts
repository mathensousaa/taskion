'use client'

import { parseAsString, useQueryState } from 'nuqs'

export interface TaskFilters {
	status?: string
}

export interface TaskFiltersActions {
	setStatus: (status: string | undefined) => void
	clearFilters: () => void
}

export function useTaskFilters(): TaskFilters & TaskFiltersActions {
	const [status, setStatus] = useQueryState('status', parseAsString)

	return {
		status: status || undefined,
		setStatus: (newStatus: string | undefined) => {
			setStatus(newStatus || null)
		},
		clearFilters: () => {
			setStatus(null)
		},
	}
}
