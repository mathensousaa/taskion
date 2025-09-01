'use client'

import { ListTodo } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from './login-form'
import { SignupForm } from './signup-form'

export function AuthContainer() {
	const [isSignup, setIsSignup] = useState(false)

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted px-4">
			<div className="w-full max-w-md">
				<Card className="border-0">
					<CardHeader className="pb-6 text-center">
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<ListTodo className="size-8" />
						</div>
						<CardTitle className="font-bold text-2xl">
							{isSignup ? 'Create your account' : 'Welcome back'}
						</CardTitle>
						<CardDescription className="text-muted-foreground">
							{isSignup
								? 'Enter your details to get started with Taskion'
								: 'Sign in to your account to continue'}
						</CardDescription>
					</CardHeader>
					<CardContent className="pb-6">
						{isSignup ? (
							<SignupForm onSwitchToLogin={() => setIsSignup(false)} />
						) : (
							<LoginForm onSwitchToSignup={() => setIsSignup(true)} />
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
