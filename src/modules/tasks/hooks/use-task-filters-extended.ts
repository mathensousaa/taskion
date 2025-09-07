'use client'

import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from 'nuqs'

export interface ExtendedTaskFilters {
	status?: string
	priority?: string[]
	assignee?: string
	dueDate?: string
	page?: number
}

export interface ExtendedTaskFiltersActions {
	setStatus: (status: string | undefined) => void
	setPriority: (priority: string[] | undefined) => void
	setAssignee: (assignee: string | undefined) => void
	setDueDate: (dueDate: string | undefined) => void
	setPage: (page: number | undefined) => void
	clearFilters: () => void
}

/**
 * Extended version of useTaskFilters that demonstrates how to add more filter types
 * This is an example of how to extend the filters in the future
 */
export function useExtendedTaskFilters(): ExtendedTaskFilters & ExtendedTaskFiltersActions {
	const [status, setStatus] = useQueryState('status', parseAsString)
	const [priority, setPriority] = useQueryState('priority', parseAsArrayOf(parseAsString))
	const [assignee, setAssignee] = useQueryState('assignee', parseAsString)
	const [dueDate, setDueDate] = useQueryState('dueDate', parseAsString)
	const [page, setPage] = useQueryState('page', parseAsInteger)

	return {
		status: status || undefined,
		priority: priority || undefined,
		assignee: assignee || undefined,
		dueDate: dueDate || undefined,
		page: page || undefined,
		setStatus: (newStatus: string | undefined) => {
			setStatus(newStatus || null)
		},
		setPriority: (newPriority: string[] | undefined) => {
			setPriority(newPriority || null)
		},
		setAssignee: (newAssignee: string | undefined) => {
			setAssignee(newAssignee || null)
		},
		setDueDate: (newDueDate: string | undefined) => {
			setDueDate(newDueDate || null)
		},
		setPage: (newPage: number | undefined) => {
			setPage(newPage || null)
		},
		clearFilters: () => {
			setStatus(null)
			setPriority(null)
			setAssignee(null)
			setDueDate(null)
			setPage(null)
		},
	}
}
