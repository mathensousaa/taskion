import {
	type UseMutationOptions,
	type UseQueryOptions,
	type UseQueryResult,
	useMutation,
	useQuery,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { ErrorResponse } from '@/backend/common/errors/error-response'

import type {
	TaskStatus,
	TaskStatusCreationInput,
	TaskStatusUpdateInput,
} from '@/backend/task-status/validation/task-status.schema'
import { api } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { parseResponseData } from '@/lib/utils'
import { keyGetTaskStatusById, keyListTaskStatuses } from '@/modules/task-status/services/keys'

export const useListTaskStatuses = (
	options?: UseQueryOptions<TaskStatus[], AxiosError<ErrorResponse>, TaskStatus[]>,
): UseQueryResult<TaskStatus[], AxiosError<ErrorResponse>> =>
	useQuery({
		queryKey: keyListTaskStatuses(),
		queryFn: () => api.get('/task-status').then((r) => parseResponseData<TaskStatus[]>(r)),
		...options,
	})

export const useGetTaskStatusById = (
	id: string | undefined,
	options?: UseQueryOptions<TaskStatus, AxiosError<ErrorResponse>, TaskStatus>,
) =>
	useQuery({
		queryKey: keyGetTaskStatusById(id),
		queryFn: () => api.get(`/task-status/${id}`).then((r) => parseResponseData<TaskStatus>(r)),
		enabled: !!id,
		...options,
	})

export const useCreateTaskStatus = (
	options?: UseMutationOptions<TaskStatus, AxiosError<ErrorResponse>, TaskStatusCreationInput>,
) =>
	useMutation({
		mutationFn: (data: TaskStatusCreationInput) =>
			api.post('/task-status', data).then(parseResponseData<TaskStatus>),
		onSuccess: (data) => {
			// Invalidate and refetch task statuses list
			queryClient.invalidateQueries({
				queryKey: keyListTaskStatuses(),
			})

			// Set the new task status in cache
			queryClient.setQueryData(keyGetTaskStatusById(data.id), data)
		},
		...options,
	})

export const useUpdateTaskStatus = (
	id: string,
	options?: UseMutationOptions<TaskStatus, AxiosError<ErrorResponse>, TaskStatusUpdateInput>,
) =>
	useMutation({
		mutationFn: (data: TaskStatusUpdateInput) =>
			api.put(`/task-status/${id}`, data).then(parseResponseData<TaskStatus>),
		onSuccess: (data) => {
			// Invalidate and refetch task statuses list
			queryClient.invalidateQueries({
				queryKey: keyListTaskStatuses(),
			})

			// Update the task status in cache
			queryClient.setQueryData(keyGetTaskStatusById(id), data)
		},
		...options,
	})

export const useDeleteTaskStatus = (
	id: string,
	options?: UseMutationOptions<void, AxiosError<ErrorResponse>, void>,
) =>
	useMutation({
		mutationFn: () => api.delete(`/task-status/${id}`).then(parseResponseData<void>),
		onSuccess: () => {
			// Invalidate and refetch task statuses list
			queryClient.invalidateQueries({
				queryKey: keyListTaskStatuses(),
			})

			// Remove the task status from cache
			queryClient.removeQueries({
				queryKey: keyGetTaskStatusById(id),
			})
		},
		...options,
	})
