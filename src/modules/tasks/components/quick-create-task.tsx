'use client'

import { Loader2, Plus } from 'lucide-react'
import { useCallback, useState, useTransition } from 'react'
import type { TaskCreationInput } from '@/backend/tasks/validation/task.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { tasksService } from '@/modules/tasks/services/tasks.service'

interface QuickCreateTaskProps {
	onTaskCreated: (task: any) => void
	className?: string
}

export function QuickCreateTask({ onTaskCreated, className }: QuickCreateTaskProps) {
	const [isExpanded, setIsExpanded] = useState(false)
	const [title, setTitle] = useState('')
	const [isPending, startTransition] = useTransition()

	const handleCreate = useCallback(async () => {
		if (!title.trim()) return

		startTransition(async () => {
			try {
				const taskData: TaskCreationInput = {
					title: title.trim(),
				}

				const response = await tasksService.create(taskData)
				if (response) {
					onTaskCreated(response)
					setTitle('')
					setIsExpanded(false)
				}
			} catch (error) {
				console.error('Failed to create task:', error)
			}
		})
	}, [title, onTaskCreated])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') {
				e.preventDefault()
				handleCreate()
			} else if (e.key === 'Escape') {
				setIsExpanded(false)
				setTitle('')
			}
		},
		[handleCreate],
	)

	const handleFocus = useCallback(() => {
		setIsExpanded(true)
	}, [])

	const handleBlur = useCallback(() => {
		// Delay hiding to allow button clicks
		setTimeout(() => {
			if (!title.trim()) {
				setIsExpanded(false)
			}
		}, 150)
	}, [title])

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
				Quick add task
			</Button>
		)
	}

	return (
		<div className={cn('flex items-center gap-2', className)}>
			<Input
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				onKeyDown={handleKeyDown}
				onFocus={handleFocus}
				onBlur={handleBlur}
				placeholder="Task title..."
				className="h-9 min-w-[200px]"
				autoFocus
				disabled={isPending}
			/>
			<Button
				onClick={handleCreate}
				size="sm"
				disabled={!title.trim() || isPending}
				className="h-9 px-3"
			>
				{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
			</Button>
		</div>
	)
}
