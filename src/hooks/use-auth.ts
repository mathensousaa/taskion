'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useCheckAuth, useLogin, useLogout } from '@/modules'

interface User {
	id: string
	email: string
	name: string
}

interface AuthState {
	user: User | undefined
	isLoading: boolean
	isAuthenticated: boolean
}

export function useAuth() {
	const [authState, setAuthState] = useState<AuthState>({
		user: undefined,
		isLoading: true,
		isAuthenticated: false,
	})

	const router = useRouter()
	const { mutate: loginUser } = useLogin()
	const { mutate: logoutUser } = useLogout()
	const { mutate: checkAuthUser } = useCheckAuth()

	const checkAuth = useCallback(() => {
		setAuthState((prev) => ({ ...prev, isLoading: true }))
		checkAuthUser(
			{},
			{
				onSuccess: ({ data: user }) => {
					setAuthState({
						user,
						isLoading: false,
						isAuthenticated: !!user,
					})
				},
				onError: (error) => {
					console.error('Auth check failed:', error)
					setAuthState({
						user: undefined,
						isLoading: false,
						isAuthenticated: false,
					})
				},
			},
		)
	}, [checkAuthUser])

	const login = useCallback(
		(email: string) => {
			loginUser(
				{ email },
				{
					onSuccess: ({ data: user }) => {
						if (user) {
							setAuthState({
								user,
								isLoading: false,
								isAuthenticated: true,
							})
						} else {
							setAuthState({
								user: undefined,
								isLoading: false,
								isAuthenticated: false,
							})
						}
					},
					onError: (error) => {
						console.error('Login failed:', error)
						setAuthState({
							user: undefined,
							isLoading: false,
							isAuthenticated: false,
						})
					},
				},
			)
		},
		[loginUser],
	)

	const logout = useCallback(() => {
		logoutUser(
			{},
			{
				onSuccess: () => {
					setAuthState({
						user: undefined,
						isLoading: false,
						isAuthenticated: false,
					})
					router.push('/login')
				},
				onError: (error) => {
					console.error('Logout failed:', error)
					setAuthState({
						user: undefined,
						isLoading: false,
						isAuthenticated: false,
					})
					router.push('/login')
				},
			},
		)
	}, [logoutUser, router])

	useEffect(() => {
		checkAuth()
	}, [checkAuth])

	return {
		...authState,
		login,
		logout,
		checkAuth,
	}
}
