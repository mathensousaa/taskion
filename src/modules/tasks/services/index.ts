import {
	type UseMutationOptions,
	type UseQueryOptions,
	type UseQueryResult,
	useMutation,
	useQuery,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { ErrorResponse } from '@/backend/common/errors/error-response'
import type { PaginatedApiResponse } from '@/backend/common/types'
import type {
	Task,
	TaskCreationInput,
	TasksReorderInput,
	TaskUpdateInput,
} from '@/backend/tasks/validation/task.schema'
import { api } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { queryKeyToUrl } from '@/lib/react-query/helpers'
import { parseResponseData } from '@/lib/utils'
import { useTaskFilters } from '@/modules/tasks/hooks/use-task-filters'
import {
	keyGetTaskById,
	keyListAllTasks,
	keyListPaginatedTasks,
} from '@/modules/tasks/services/keys'

export const useListTasks = (
	limit: number,
	cursor?: { order: string; created_at: string; id: string },
	status?: string,
	options?: UseQueryOptions<
		PaginatedApiResponse<Task>,
		AxiosError<ErrorResponse>,
		PaginatedApiResponse<Task>
	>,
): UseQueryResult<PaginatedApiResponse<Task>, AxiosError<ErrorResponse>> =>
	useQuery({
		queryKey: keyListPaginatedTasks(limit, cursor, status),
		queryFn: () =>
			api
				.get(`/tasks/paginated${queryKeyToUrl(keyListPaginatedTasks(limit, cursor, status))}`)
				.then((r) => parseResponseData<PaginatedApiResponse<Task>>(r, { useRawData: true })),
		...options,
	})

export const useListAllTasks = (
	filters: { status?: string },
	options?: Omit<UseQueryOptions<Task[], AxiosError<ErrorResponse>, Task[]>, 'queryKey'>,
): UseQueryResult<Task[], AxiosError<ErrorResponse>> =>
	useQuery({
		queryKey: keyListAllTasks(filters),
		...options,
	})

export const useListRecentTasks = (
	limit: number = 5,
	options?: UseQueryOptions<Task[], AxiosError<ErrorResponse>, Task[]>,
): UseQueryResult<Task[], AxiosError<ErrorResponse>> =>
	useQuery({
		queryKey: ['tasks', 'recent', limit],
		queryFn: () =>
			api
				.get(`/tasks`)
				.then((r) => parseResponseData<Task[]>(r))
				.then((tasks) =>
					tasks
						.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
						.slice(0, limit),
				),
		...options,
	})

export const useGetTaskById = (
	id: string | undefined,
	options?: UseQueryOptions<Task, AxiosError<ErrorResponse>, Task>,
) =>
	useQuery({
		queryKey: keyGetTaskById(id),
		enabled: !!id,
		...options,
	})

export const useCreateTask = (
	pendingTaskId?: string,
	options?: UseMutationOptions<Task, AxiosError<ErrorResponse>, TaskCreationInput>,
) => {
	const { status } = useTaskFilters()

	return useMutation({
		mutationKey: ['createTask', pendingTaskId],
		mutationFn: (data: TaskCreationInput) => api.post(`/tasks`, data).then(parseResponseData<Task>),
		onSuccess: (data, variables) => {
			// Update the query cache
			queryClient.setQueryData(keyListAllTasks({ status }), (oldData: Task[]) => {
				if (variables.position === 'top') {
					return [data, ...oldData]
				}
				return [...oldData, data]
			})

			queryClient.invalidateQueries({ queryKey: ['tasks', 'recent'] })

			// Call the external onSuccess if provided
			options?.onSuccess?.(data, variables, undefined)
		},
		...options,
	})
}

export const useUpdateTask = (
	id: string,
	options?: UseMutationOptions<Task, AxiosError<ErrorResponse>, TaskUpdateInput>,
) => {
	const { status } = useTaskFilters()

	return useMutation({
		mutationFn: (data: TaskUpdateInput) =>
			api.put(`/tasks/${id}`, data).then(parseResponseData<Task>),
		onSuccess: (data) => {
			queryClient.setQueryData(keyListAllTasks({ status }), (oldData: Task[]) => {
				return oldData.map((task) => (task.id === id ? { ...task, ...data } : task))
			})
			queryClient.setQueryData(keyGetTaskById(id), data)
			queryClient.invalidateQueries({ queryKey: ['tasks', 'recent'] })
		},
		...options,
	})
}

export const useDeleteTask = (
	id: string,
	options?: UseMutationOptions<void, AxiosError<ErrorResponse>, void>,
) => {
	const { status } = useTaskFilters()

	return useMutation({
		mutationFn: () => api.delete(`/tasks/${id}`).then(parseResponseData<void>),
		onSuccess: () => {
			queryClient.setQueryData(keyListAllTasks({ status }), (oldData: Task[]) => {
				return oldData.filter((task) => task.id !== id)
			})
			queryClient.removeQueries({
				queryKey: keyGetTaskById(id),
			})
			queryClient.invalidateQueries({ queryKey: ['tasks', 'recent'] })
		},
		...options,
	})
}

export const useReorderTasks = (
	options?: UseMutationOptions<void, AxiosError<ErrorResponse>, TasksReorderInput>,
) =>
	useMutation({
		mutationFn: (data: TasksReorderInput) =>
			api.patch(`/tasks`, data).then(parseResponseData<void>),
		...options,
	})

export const useReorderTaskBetween = (
	options?: UseMutationOptions<
		Task[],
		AxiosError<ErrorResponse>,
		{ taskId: string; previousTaskId?: string; nextTaskId?: string }
	>,
) =>
	useMutation({
		mutationFn: (data: { taskId: string; previousTaskId?: string; nextTaskId?: string }) =>
			api.post(`/tasks/reorder`, data).then(parseResponseData<Task[]>),
		...options,
	})

export const useToggleTaskStatus = (
	id: string,
	options?: UseMutationOptions<Task, AxiosError<ErrorResponse>, void>,
) => {
	const { status } = useTaskFilters()

	return useMutation({
		mutationFn: () => api.patch(`/tasks/${id}/status/toggle`).then(parseResponseData<Task>),
		onSuccess: (data) => {
			queryClient.setQueryData(keyGetTaskById(id), (oldData: Task) => {
				return {
					...oldData,
					status_id: data?.status_id || oldData.status_id,
				}
			})
			queryClient.setQueryData(keyListAllTasks({ status }), (oldData: Task[]) => {
				return oldData.map((task) =>
					task.id === id ? { ...task, status_id: data?.status_id || task.status_id } : task,
				)
			})
		},
		...options,
	})
}

export const useUpdateTaskStatusBySlug = (
	id: string,
	options?: UseMutationOptions<Task, AxiosError<ErrorResponse>, string>,
) =>
	useMutation({
		mutationFn: (statusSlug: string) =>
			api.patch(`/tasks/${id}/status`, { status_slug: statusSlug }).then(parseResponseData<Task>),
		onSuccess: (data) => {
			queryClient.setQueryData(keyGetTaskById(id), data)
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0] === 'tasks' && query.queryKey[1] === '#all',
			})
		},
		...options,
	})

export const useEnhanceTask = (
	id: string,
	options?: UseMutationOptions<Task, AxiosError<ErrorResponse>, void>,
) => {
	const { status } = useTaskFilters()

	return useMutation({
		mutationFn: () => api.post(`/tasks/${id}/enhance`).then(parseResponseData<Task>),
		onSuccess: (data) => {
			queryClient.setQueryData(keyGetTaskById(id), data)
			queryClient.setQueryData(keyListAllTasks({ status }), (oldData: Task[]) => {
				return oldData.map((task) => (task.id === id ? { ...task, ...data } : task))
			})
			queryClient.invalidateQueries({ queryKey: ['tasks', 'recent'] })
		},
		...options,
	})
}
