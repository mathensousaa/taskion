'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { TaskCreationInput } from '@/backend/tasks/validation/task.schema'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import TaskStatusToggleButton from '@/modules/tasks/components/task-status-toggle-button'

const NewTaskSchema = z.object({
	title: z
		.string()
		.min(1, 'Title is required')
		.refine((title) => title.trim().split(/\s+/).length >= 3, {
			message: 'Please provide more details. Enter at least 3 words',
		}),
})

type NewTaskFormData = z.infer<typeof NewTaskSchema>

interface NewTaskCardProps {
	onSubmit: (data: TaskCreationInput) => Promise<void>
	onCancel: () => void
	onRetry?: () => void
	isSubmitting?: boolean
	hasError?: boolean
	errorMessage?: string
}

export function NewTaskCard({
	onSubmit,
	onCancel,
	onRetry,
	isSubmitting = false,
	hasError = false,
	errorMessage,
}: NewTaskCardProps) {
	const titleInputRef = useRef<HTMLInputElement>(null)
	const formRef = useRef<HTMLFormElement>(null)

	const form = useForm<NewTaskFormData>({
		resolver: zodResolver(NewTaskSchema),
		defaultValues: {
			title: '',
		},
	})

	// Handle click outside to cancel
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (formRef.current && !formRef.current.contains(event.target as Node)) {
				onCancel()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [onCancel])

	// Focus the input when the component mounts
	useEffect(() => {
		setTimeout(() => titleInputRef.current?.focus(), 0)
	}, [])

	const handleSubmit = useCallback(
		async (values: NewTaskFormData) => {
			if (values.title.trim()) {
				await onSubmit({ title: values.title.trim() })
			}
		},
		[onSubmit],
	)

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				form.handleSubmit(handleSubmit)()
			} else if (e.key === 'Escape') {
				onCancel()
			}
		},
		[form, handleSubmit, onCancel],
	)

	const handleCancel = useCallback(() => {
		form.reset()
		onCancel()
	}, [form, onCancel])

	return (
		<Form {...form}>
			<form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)} className="">
				<Card className="group relative rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
					<div className="flex items-center gap-2">
						<TaskStatusToggleButton taskId="" taskStatusId={undefined} />
						<div className="flex-1">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormControl>
											<Input
												{...field}
												ref={titleInputRef}
												onKeyDown={handleKeyDown}
												variant="transparent"
												placeholder="Type a title..."
												className={cn(
													'h-8 border-none font-medium text-base shadow-none ring-0 focus-visible:ring-0',
													!field.value && 'opacity-50',
												)}
												disabled={isSubmitting}
											/>
										</FormControl>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>
							{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
						</div>
					</div>

					{/* Task Content */}
					<div className="space-y-3">
						{/* Description Skeleton while submitting */}
						{isSubmitting && (
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-muted-foreground text-sm">
									<Loader2 className="h-4 w-4 animate-spin" />
									Creating your task...
								</div>
								<div className="space-y-1">
									<Skeleton className="h-3 w-2/3" />
									<Skeleton className="h-3 w-1/2" />
								</div>
							</div>
						)}

						{/* Error State */}
						{hasError && (
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-destructive text-sm">
									<svg
										className="h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									{errorMessage || 'Failed to create task'}
								</div>
							</div>
						)}
					</div>
				</Card>
				{/* Action Buttons */}
				<div className="flex items-center justify-end gap-2 pt-2">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleCancel}
						disabled={isSubmitting}
						className="h-8 px-3"
					>
						Cancel
					</Button>
					{hasError && onRetry ? (
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onRetry}
							disabled={isSubmitting}
							className="h-8 px-3"
						>
							Retry
						</Button>
					) : (
						<Button type="submit" size="sm" disabled={isSubmitting} className="h-8 px-3">
							Create Task
						</Button>
					)}
				</div>
			</form>
		</Form>
	)
}
