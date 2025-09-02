'use client'

import { Calendar, Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import Markdown from 'react-markdown'
import type { Task } from '@/backend/tasks/validation/task.schema'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn, truncateToWords } from '@/lib/utils'
import { usePermanentlyDeleteTask } from '@/modules/trash/services/trash.service'

interface TrashTaskCardProps {
	task: Task
	onPermanentlyDelete: (taskId: string) => void
	className?: string
}

export function TrashTaskCard({ task, onPermanentlyDelete, className }: TrashTaskCardProps) {
	const { mutate: permanentlyDeleteTask, isPending: isDeleting } = usePermanentlyDeleteTask()

	const handlePermanentlyDelete = async () => {
		permanentlyDeleteTask(task.id, {
			onSuccess: () => {
				onPermanentlyDelete(task.id)
			},
			onError: (error) => {
				console.error('Failed to permanently delete task:', error)
			},
		})
	}

	const formatDeletedDate = (deletedAt: string) => {
		const date = new Date(deletedAt)
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	return (
		<div
			className={cn(
				'group relative rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md',
				className,
			)}
		>
			{/* Task Content */}
			<div className="space-y-3">
				{/* Title */}
				<div className="min-h-[24px]">
					<div className="font-medium text-base text-muted-foreground line-through">
						{task.title}
					</div>
				</div>

				{/* Description */}
				{task.description && (
					<div className="text-muted-foreground text-xs">
						<Markdown>{truncateToWords(task.description, 5)}</Markdown>
					</div>
				)}

				{/* Deleted Date */}
				{task.deleted_at && (
					<div className="flex items-center gap-2 text-muted-foreground text-xs">
						<Calendar className="h-3 w-3" />
						<span>Deleted on {formatDeletedDate(task.deleted_at)}</span>
					</div>
				)}
			</div>

			{/* Actions Menu */}
			<div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<Trash2 className="h-4 w-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={handlePermanentlyDelete}
							className="text-destructive focus:text-destructive"
							disabled={isDeleting}
						>
							{isDeleting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								<>
									<Trash2 className="mr-2 h-4 w-4" />
									Permanently Delete
								</>
							)}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	)
}
