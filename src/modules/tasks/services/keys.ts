import { objectToQueryParams } from '@/lib/utils'

export const keyListPaginatedTasks = (
	limit: number,
	cursor?: { order: string; created_at: string; id: string },
	status?: string,
) => ['tasks', 'paginated', ...objectToQueryParams({ limit, cursor, status })]

export const keyListAllTasks = (filters: { status?: string }) => [
	'tasks',
	'#all',
	...objectToQueryParams(filters),
]

export const keyGetTaskById = (id: string | undefined) => ['tasks', id]
