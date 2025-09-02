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
import { isQueryParam, parseResponseData } from '@/lib/utils'
import { keyGetTaskById, keyListPaginatedTasks } from '@/modules/tasks/services/keys'

export const useListTasks = (
	limit: number,
	cursor?: { order: number; created_at: string; id: string },
	options?: UseQueryOptions<
		PaginatedApiResponse<Task>,
		AxiosError<ErrorResponse>,
		PaginatedApiResponse<Task>
	>,
): UseQueryResult<PaginatedApiResponse<Task>, AxiosError<ErrorResponse>> =>
	useQuery({
		queryKey: keyListPaginatedTasks(limit, cursor),
		queryFn: () =>
			api
				.get(queryKeyToUrl(keyListPaginatedTasks(limit, cursor)))
				.then((r) => parseResponseData<PaginatedApiResponse<Task>>(r, { useRawData: true })),
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
	options?: UseMutationOptions<Task, AxiosError<ErrorResponse>, TaskCreationInput>,
) =>
	useMutation({
		mutationFn: (data: TaskCreationInput) => api.post(`/tasks`, data).then(parseResponseData<Task>),
		...options,
	})

export const useUpdateTask = (
	id: string,
	options?: UseMutationOptions<Task, AxiosError<ErrorResponse>, TaskUpdateInput>,
) =>
	useMutation({
		mutationFn: (data: TaskUpdateInput) =>
			api.put(`/tasks/${id}`, data).then(parseResponseData<Task>),
		...options,
	})

export const useDeleteTask = (
	id: string,
	options?: UseMutationOptions<void, AxiosError<ErrorResponse>, void>,
) =>
	useMutation({
		mutationFn: () => api.delete(`/tasks/${id}`).then(parseResponseData<void>),
		...options,
	})

export const useReorderTasks = (
	options?: UseMutationOptions<void, AxiosError<ErrorResponse>, TasksReorderInput>,
) =>
	useMutation({
		mutationFn: (data: TasksReorderInput) =>
			api.patch(`/tasks`, data).then(parseResponseData<void>),
		...options,
	})

export const useToggleTaskStatus = (
	id: string,
	options?: UseMutationOptions<Task, AxiosError<ErrorResponse>, void>,
) =>
	useMutation({
		mutationFn: () => api.patch(`/tasks/${id}/toggle-status`).then(parseResponseData<Task>),
		onSuccess: (data) => {
			console.log('data', data)

			queryClient.setQueryData(keyGetTaskById(id), (oldData: Task) => {
				return {
					...oldData,
					status_id: data.status_id,
				}
			})

			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0] === 'tasks' && isQueryParam(query.queryKey[1]),
			})
		},
		...options,
	})
