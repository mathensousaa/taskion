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
	User,
	UserCreationInput,
	UserUpdateInput,
} from '@/backend/users/validation/user.schema'
import { api } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { parseResponseData } from '@/lib/utils'
import { keyGetUserById, keyListUsers } from '@/modules/users/services/keys'

export const useListUsers = (
	options?: UseQueryOptions<User[], AxiosError<ErrorResponse>, User[]>,
): UseQueryResult<User[], AxiosError<ErrorResponse>> =>
	useQuery({
		queryKey: keyListUsers(),
		queryFn: () => api.get('/users').then((r) => parseResponseData<User[]>(r)),
		...options,
	})

export const useGetUserById = (
	id: string | undefined,
	options?: UseQueryOptions<User, AxiosError<ErrorResponse>, User>,
) =>
	useQuery({
		queryKey: keyGetUserById(id),
		queryFn: () => api.get(`/users/${id}`).then((r) => parseResponseData<User>(r)),
		enabled: !!id,
		...options,
	})

export const useCreateUser = (
	options?: UseMutationOptions<User, AxiosError<ErrorResponse>, UserCreationInput>,
) =>
	useMutation({
		mutationFn: (data: UserCreationInput) => api.post('/users', data).then(parseResponseData<User>),
		onSuccess: (data) => {
			// Invalidate and refetch users list
			queryClient.invalidateQueries({
				queryKey: keyListUsers(),
			})

			// Set the new user in cache
			queryClient.setQueryData(keyGetUserById(data.id), data)
		},
		...options,
	})

export const useUpdateUser = (
	id: string,
	options?: UseMutationOptions<User, AxiosError<ErrorResponse>, UserUpdateInput>,
) =>
	useMutation({
		mutationFn: (data: UserUpdateInput) =>
			api.put(`/users/${id}`, data).then(parseResponseData<User>),
		onSuccess: (data) => {
			// Invalidate and refetch users list
			queryClient.invalidateQueries({
				queryKey: keyListUsers(),
			})

			// Update the user in cache
			queryClient.setQueryData(keyGetUserById(id), data)
		},
		...options,
	})

export const useDeleteUser = (
	id: string,
	options?: UseMutationOptions<void, AxiosError<ErrorResponse>, void>,
) =>
	useMutation({
		mutationFn: () => api.delete(`/users/${id}`).then(parseResponseData<void>),
		onSuccess: () => {
			// Invalidate and refetch users list
			queryClient.invalidateQueries({
				queryKey: keyListUsers(),
			})

			// Remove the user from cache
			queryClient.removeQueries({
				queryKey: keyGetUserById(id),
			})
		},
		...options,
	})
