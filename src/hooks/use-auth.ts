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
	user: User | null
	isLoading: boolean
	isAuthenticated: boolean
}

export function useAuth() {
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
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
					console.log('user', user)
					if (user) {
						setAuthState({
							user,
							isLoading: false,
							isAuthenticated: true,
						})
					}
				},
				onError: (error) => {
					console.error('Auth check failed:', error)
					setAuthState({
						user: null,
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
						}

						return { success: false, message: 'Login failed' }
					},
					onError: (error) => {
						console.error('Login failed:', error)
						setAuthState({
							user: null,
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
					console.log('logout successful')
					setAuthState({
						user: null,
						isLoading: false,
						isAuthenticated: false,
					})
					router.push('/login')
				},
				onError: (error) => {
					console.error('Logout failed:', error)
					setAuthState({
						user: null,
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
