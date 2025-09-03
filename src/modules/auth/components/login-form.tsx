'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import { useLogin } from '@/modules/auth/services'

const LoginSchema = z.object({
	email: z.email('Please enter a valid email address'),
})

type LoginFormData = z.infer<typeof LoginSchema>

export function LoginForm() {
	const searchParams = useSearchParams()

	const [apiError, setApiError] = useState<string>('')
	const { mutate: login, isPending } = useLogin()
	const form = useForm<LoginFormData>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
		},
	})

	const onSubmit = (credentials: LoginFormData) => {
		setApiError('')

		login(credentials, {
			onSuccess: () => {
				const redirectTo = searchParams.get('redirect') || '/'
				// Use window.location.href for a full page reload to ensure
				// the middleware properly recognizes the new session cookie
				window.location.href = redirectTo
			},
			onError: ({ response }) => {
				if (response?.data.message) setApiError(response.data.message)
			},
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="font-bold text-2xl">Login to your account</h1>
					<p className="text-balance text-muted-foreground text-sm">
						Enter your email below to login to your account
					</p>
				</div>

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

				<Button type="submit" className="w-full" disabled={isPending}>
					{isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Signing in...
						</>
					) : (
						'Sign in'
					)}
				</Button>

				<div className="text-center">
					<div className="text-center text-sm">
						Don&apos;t have an account?{' '}
						<Link
							href="/register"
							className="px-0 font-medium text-primary underline underline-offset-4"
						>
							Sign up
						</Link>
					</div>
				</div>
			</form>
		</Form>
	)
}
