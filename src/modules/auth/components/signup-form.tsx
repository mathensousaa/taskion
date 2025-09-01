'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail, User } from 'lucide-react'
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
import { usersService } from '@/modules/users/services/users.service'

const SignupSchema = z.object({
	name: z.string().min(6, 'Name must be at least 6 characters long'),
	email: z.email('Please enter a valid email address'),
})

type SignupFormData = z.infer<typeof SignupSchema>

interface SignupFormProps {
	onSwitchToLogin: () => void
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
	const router = useRouter()

	const form = useForm<SignupFormData>({
		resolver: zodResolver(SignupSchema),
		defaultValues: {
			name: '',
			email: '',
		},
	})

	const [isLoading, setIsLoading] = useState(false)
	const [apiError, setApiError] = useState<string>('')

	const onSubmit = async (values: SignupFormData) => {
		setApiError('')

		try {
			setIsLoading(true)
			const user = await usersService.create(values)

			if (user) {
				const loginResponse = await authService.login({ email: values.email })

				if (loginResponse.success) {
					router.push('/')
				} else {
					setApiError('Account created but login failed. Please try logging in.')
				}
			}
		} catch (error: unknown) {
			console.error('Signup error:', error)

			if (error instanceof ApiError) {
				setApiError(error.message)
			} else {
				setApiError('An error occurred during signup. Please try again.')
			}
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{apiError && (
					<Alert variant="destructive">
						<AlertDescription>{apiError}</AlertDescription>
					</Alert>
				)}

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel htmlFor="name">Full Name</FormLabel>
							<FormControl>
								<div className="relative">
									<User className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
									<Input className="pl-10" placeholder="Enter your full name" {...field} />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel htmlFor="email">Email</FormLabel>
							<FormControl>
								<div className="relative">
									<Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
									<Input className="pl-10" placeholder="Enter your email" {...field} />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Creating account...
						</>
					) : (
						'Create account'
					)}
				</Button>

				<div className="text-center">
					<Button
						type="button"
						variant="ghost"
						onClick={onSwitchToLogin}
						className="text-muted-foreground text-sm"
						disabled={isLoading}
					>
						Already have an account? Sign in
					</Button>
				</div>
			</form>
		</Form>
	)
}
