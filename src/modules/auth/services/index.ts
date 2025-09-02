import {
	type UseMutationOptions,
	type UseQueryOptions,
	type UseQueryResult,
	useMutation,
	useQuery,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { AuthResponse, LoginInput } from '@/backend/auth/validation/auth.schema'
import type { ErrorResponse } from '@/backend/common/errors/error-response'
import type { User } from '@/backend/users/validation/user.schema'
import { api } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { parseResponseData } from '@/lib/utils'
import { keyAuthMe } from '@/modules/auth/services/keys'

export const useGetMe = (
	options?: UseQueryOptions<AuthResponse, AxiosError<ErrorResponse>, AuthResponse>,
): UseQueryResult<AuthResponse, AxiosError<ErrorResponse>> =>
	useQuery({
		queryKey: keyAuthMe(),
		queryFn: () => api.get('/me').then((r) => parseResponseData<AuthResponse>(r)),
		...options,
	})

export const useCheckAuth = (
	options?: UseMutationOptions<AuthResponse, AxiosError<ErrorResponse>, Record<string, never>>,
) =>
	useMutation({
		mutationFn: () =>
			api.get('/me').then((r) => parseResponseData<AuthResponse>(r, { useRawData: true })),
		...options,
	})

export const useLogin = (
	options?: UseMutationOptions<AuthResponse, AxiosError<ErrorResponse>, LoginInput>,
) =>
	useMutation({
		mutationFn: (data: LoginInput) =>
			api
				.post('/login', data)
				.then((r) => parseResponseData<AuthResponse>(r, { useRawData: true })),
		onSuccess: (data) => {
			// Set the user data in cache
			queryClient.setQueryData(keyAuthMe(), data)
		},
		...options,
	})

export const useLogout = (
	options?: UseMutationOptions<void, AxiosError<ErrorResponse>, Record<string, never>>,
) =>
	useMutation({
		mutationFn: () => api.post('/logout').then(parseResponseData<void>),
		onSuccess: () => {
			// Clear all auth-related queries
			queryClient.removeQueries({
				queryKey: keyAuthMe(),
			})
			// Clear all queries to reset the entire app state
			queryClient.clear()
		},
		...options,
	})
