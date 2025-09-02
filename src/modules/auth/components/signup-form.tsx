'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail, User } from 'lucide-react'
import Link from 'next/link'
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
import { useLogin } from '@/modules/auth/services'
import { useCreateUser } from '@/modules/users/services'

const SignupSchema = z.object({
	name: z.string().min(6, 'Name must be at least 6 characters long'),
	email: z.email('Please enter a valid email address'),
})

type SignupFormData = z.infer<typeof SignupSchema>

export function SignupForm() {
	const form = useForm<SignupFormData>({
		resolver: zodResolver(SignupSchema),
		defaultValues: {
			name: '',
			email: '',
		},
	})
	const router = useRouter()
	const { mutate: createUser, isPending } = useCreateUser()
	const { mutate: login } = useLogin()

	const [apiError, setApiError] = useState<string>('')

	const onSubmit = (values: SignupFormData) => {
		setApiError('')

		createUser(values, {
			onSuccess: () => {
				login(
					{ email: values.email },
					{
						onSuccess: () => {
							router.push('/')
						},
						onError: ({ response }) => {
							if (response?.data.message) setApiError(response.data.message)
						},
					},
				)
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
					<h1 className="font-bold text-2xl">Create your account</h1>
					<p className="text-balance text-muted-foreground text-sm">
						Enter your details to get started with Taskion
					</p>
				</div>

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

				<Button type="submit" className="w-full" disabled={isPending}>
					{isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Creating account...
						</>
					) : (
						'Create account'
					)}
				</Button>

				<div className="text-center">
					<div className="text-center text-sm">
						Already have an account?{' '}
						<Link
							href="/login"
							className="px-0 font-medium text-primary underline underline-offset-4"
						>
							Sign in
						</Link>
					</div>
				</div>
			</form>
		</Form>
	)
}
