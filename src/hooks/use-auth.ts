'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { authService } from '@/modules/auth/services/auth.service'

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
	const router = useRouter()
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		isLoading: true,
		isAuthenticated: false,
	})

	const checkAuth = useCallback(async () => {
		try {
			setAuthState((prev) => ({ ...prev, isLoading: true }))
			const response = await authService.me()

			if (response.success && response.data) {
				setAuthState({
					user: response.data,
					isLoading: false,
					isAuthenticated: true,
				})
			} else {
				setAuthState({
					user: null,
					isLoading: false,
					isAuthenticated: false,
				})
			}
		} catch (error) {
			console.error('Auth check failed:', error)
			setAuthState({
				user: null,
				isLoading: false,
				isAuthenticated: false,
			})
		}
	}, [])

	const login = useCallback(async (email: string) => {
		try {
			const response = await authService.login({ email })

			if (response.success && response.data) {
				setAuthState({
					user: response.data,
					isLoading: false,
					isAuthenticated: true,
				})
				return { success: true }
			} else {
				return { success: false, message: response.message }
			}
		} catch (error) {
			console.error('Login failed:', error)
			return { success: false, message: 'Login failed' }
		}
	}, [])

	const logout = useCallback(async () => {
		try {
			await authService.logout()
			setAuthState({
				user: null,
				isLoading: false,
				isAuthenticated: false,
			})
			router.push('/login')
		} catch (error) {
			console.error('Logout failed:', error)
		}
	}, [router])

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
