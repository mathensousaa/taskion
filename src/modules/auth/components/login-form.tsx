'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ApiError } from '@/backend/common/errors/api-error'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authService } from '@/modules/auth/services/auth.service'

const LoginSchema = z.object({
	email: z.email('Please enter a valid email address'),
})

type LoginFormData = z.infer<typeof LoginSchema>

interface LoginFormProps {
	onSwitchToSignup: () => void
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [apiError, setApiError] = useState<string>('')

	const form = useForm<LoginFormData>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
		},
	})

	const onSubmit = async (credentials: LoginFormData) => {
		setApiError('')

		try {
			setIsLoading(true)
			const response = await authService.login(credentials)

			if (response.success) {
				router.push('/')
			} else {
				setApiError(response.message || 'Login failed. Please try again.')
			}
		} catch (error: unknown) {
			console.error('Login error:', error)

			if (error instanceof ApiError) {
				setApiError(error.message)
			} else {
				setApiError('An error occurred during login. Please try again.')
			}
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{apiError && (
					<Alert variant="destructive" className="text-center">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{apiError}</AlertDescription>
					</Alert>
				)}

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-mail</FormLabel>
							<FormControl>
								<div className="relative">
									<Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
									<Input className="pl-10" {...field} placeholder="Enter your email" />
								</div>
							</FormControl>
							<FormMessage className="text-xs" />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Signing in...
						</>
					) : (
						'Sign in'
					)}
				</Button>

				<div className="text-center">
					<Button
						type="button"
						variant="ghost"
						onClick={onSwitchToSignup}
						className="text-muted-foreground text-sm"
						disabled={isLoading}
					>
						Don't have an account? Register
					</Button>
				</div>
			</form>
		</Form>
	)
}
