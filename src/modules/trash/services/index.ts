import {
	type UseMutationOptions,
	type UseQueryOptions,
	type UseQueryResult,
	useMutation,
	useQuery,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { ErrorResponse } from '@/backend/common/errors/error-response'
import type { Task } from '@/backend/tasks/validation/task.schema'
import { api } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { parseResponseData } from '@/lib/utils'
import { keyListTrash } from '@/modules/trash/services/keys'

export const useListTrash = (
	options?: UseQueryOptions<Task[], AxiosError<ErrorResponse>, Task[]>,
): UseQueryResult<Task[], AxiosError<ErrorResponse>> =>
	useQuery({
		queryKey: keyListTrash(),
		queryFn: () => api.get('/trash').then((r) => parseResponseData<Task[]>(r)),
		...options,
	})

export const usePermanentlyDeleteTask = (
	options?: UseMutationOptions<void, AxiosError<ErrorResponse>, string>,
) =>
	useMutation({
		mutationFn: (id: string) => api.delete(`/trash/${id}`).then(parseResponseData<void>),
		onSuccess: (_, id) => {
			queryClient.setQueryData<Task[]>(keyListTrash(), (old: Task[] | undefined) =>
				old ? old.filter((task) => task.id !== id) : [],
			)

			// Invalidate tasks list to reflect the permanent deletion
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0] === 'tasks',
			})
		},
		...options,
	})

export const useEmptyTrash = (
	options?: UseMutationOptions<void, AxiosError<ErrorResponse>, Record<string, never>>,
) =>
	useMutation({
		mutationFn: () => api.delete('/trash').then(parseResponseData<void>),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: keyListTrash(),
			})
		},
		...options,
	})

export const useRestoreTask = (
	options?: UseMutationOptions<Task, AxiosError<ErrorResponse>, string>,
) =>
	useMutation({
		mutationFn: (id: string) =>
			api.post(`/trash/${id}/restore`).then((r) => parseResponseData<Task>(r)),
		onSuccess: (_, id) => {
			// Remove the task from trash list
			queryClient.setQueryData<Task[]>(keyListTrash(), (old: Task[] | undefined) =>
				old ? old.filter((task) => task.id !== id) : [],
			)

			// Invalidate tasks list to show the restored task
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0] === 'tasks',
			})
		},
		...options,
	})
