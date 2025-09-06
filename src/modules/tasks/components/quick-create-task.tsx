'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { queryClient } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import { useCreateTask } from '@/modules/tasks/services'
import { showTaskCreateError, showTaskCreateSuccess } from '@/modules/tasks/utils'

const QuickCreateTaskSchema = z.object({
	title: z
		.string()
		.min(1, 'Title is required.')
		.refine((title) => title.trim().split(/\s+/).length >= 3, {
			message: 'Please provide more details. Enter at least 3 words.',
		})
		.trim(),
})

type QuickCreateTaskFormData = z.infer<typeof QuickCreateTaskSchema>

interface QuickCreateTaskProps {
	className?: string
}

export function QuickCreateTask({ className }: QuickCreateTaskProps) {
	const [isExpanded, setIsExpanded] = useState(false)

	const form = useForm<QuickCreateTaskFormData>({
		resolver: zodResolver(QuickCreateTaskSchema),
		defaultValues: {
			title: '',
		},
	})

	const { mutate: createTask, isPending } = useCreateTask()

	const handleCreate = useCallback(
		(values: QuickCreateTaskFormData) => {
			createTask(values, {
				onSuccess: (newTask) => {
					form.reset()
					setIsExpanded(false)
					showTaskCreateSuccess(newTask.title)
					queryClient.invalidateQueries({
						predicate: (query) => query.queryKey[0] === 'tasks' && query.queryKey[1] === '#all',
					})
				},
				onError: (error) => {
					showTaskCreateError(error)
				},
			})
		},
		[createTask, form.reset],
	)

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') {
				e.preventDefault()
				form.handleSubmit(handleCreate)()
			} else if (e.key === 'Escape') {
				setIsExpanded(false)
				form.reset()
			}
		},
		[form, handleCreate],
	)

	const handleFocus = useCallback(() => {
		setIsExpanded(true)
	}, [])

	const handleBlur = useCallback(() => {
		// Delay hiding to allow button clicks.
		setTimeout(() => {
			if (!form.getValues('title').trim()) {
				setIsExpanded(false)
			}
		}, 150)
	}, [form])

	if (!isExpanded) {
		return (
			<Button
				onClick={() => setIsExpanded(true)}
				variant="outline"
				size="sm"
				className={cn(
					'gap-2 border-muted-foreground/30 border-dashed text-muted-foreground transition-all hover:border-muted-foreground/50 hover:text-foreground',
					className,
				)}
			>
				<Plus className="h-4 w-4" />
				Add task
			</Button>
		)
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleCreate)}
				className={cn('flex items-center gap-2', className)}
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormControl>
								<Input
									{...field}
									onKeyDown={handleKeyDown}
									onFocus={handleFocus}
									onBlur={handleBlur}
									placeholder="Enter at least 3 words for task title"
									className="h-9 min-w-[200px]"
									autoFocus
									disabled={isPending}
								/>
							</FormControl>
							<FormMessage className="text-xs" />
						</FormItem>
					)}
				/>
				<Button type="submit" size="sm" disabled={isPending} className="h-9 px-3">
					{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
				</Button>
			</form>
		</Form>
	)
}
