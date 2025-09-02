import { objectToQueryParams } from '@/lib/utils'

export const keyListPaginatedTasks = (
	limit: number,
	cursor?: { order: number; created_at: string; id: string },
) => ['tasks', ...objectToQueryParams({ limit, cursor })]

export const keyGetTaskById = (id: string | undefined) => ['tasks', id]
