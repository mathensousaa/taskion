'use client'

import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'

interface ProtectedRouteProps {
	children: React.ReactNode
	fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
	const { isAuthenticated, isLoading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			// Get current pathname for redirect
			const currentPath = window.location.pathname
			const redirectUrl =
				currentPath === '/' ? '/login' : `/login?redirect=${encodeURIComponent(currentPath)}`
			router.push(redirectUrl)
		}
	}, [isAuthenticated, isLoading, router])

	if (isLoading) {
		return (
			fallback || (
				<div className="flex min-h-screen items-center justify-center">
					<div className="flex flex-col items-center space-y-4">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<p className="text-muted-foreground">Loading...</p>
					</div>
				</div>
			)
		)
	}

	if (!isAuthenticated) {
		return null // Will redirect to login
	}

	return <>{children}</>
}
