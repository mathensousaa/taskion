'use client'

import { Calendar, CheckCircle, Circle, Clock, FileText, Search } from 'lucide-react'
import * as React from 'react'
import type { Task } from '@/backend/tasks/validation/task.schema'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { useListAllTasks } from '@/modules/tasks/services'
import { TaskDetailDialog } from './task-detail-dialog'

interface TaskSearchDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function TaskSearchDialog({ open, onOpenChange }: TaskSearchDialogProps) {
	const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
	const [searchQuery, setSearchQuery] = React.useState('')

	const { data: allTasks, isLoading } = useListAllTasks({})

	// Add keyboard shortcut (Cmd/Ctrl + K) to open search dialog
	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				onOpenChange(!open)
			}
		}

		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [open, onOpenChange])

	// Filter tasks based on search query
	const filteredTasks = React.useMemo(() => {
		if (!allTasks || !searchQuery.trim()) return []

		const query = searchQuery.toLowerCase().trim()
		return allTasks.filter((task) => {
			const titleMatch = task.title.toLowerCase().includes(query)
			const descriptionMatch = task.description?.toLowerCase().includes(query) || false
			return titleMatch || descriptionMatch
		})
	}, [allTasks, searchQuery])

	const handleTaskSelect = (task: Task) => {
		setSelectedTaskId(task.id)
		onOpenChange(false)
	}

	const getStatusIcon = (statusId: string) => {
		// You might want to map this to actual status types
		// For now, using generic icons
		switch (statusId) {
			case 'completed':
				return <CheckCircle className="h-4 w-4 text-green-500" />
			case 'in-progress':
				return <Clock className="h-4 w-4 text-blue-500" />
			default:
				return <Circle className="h-4 w-4 text-gray-500" />
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})
	}

	return (
		<>
			<CommandDialog open={open} onOpenChange={onOpenChange}>
				<div className="flex items-center border-b px-3 py-2">
					<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
					<Input
						placeholder="Search tasks by title or description..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="border-0 bg-transparent focus:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
					/>
				</div>
				<CommandList>
					{!searchQuery.trim() ? (
						<div className="py-6 text-center text-muted-foreground">
							<Search className="mx-auto mb-2 h-8 w-8 opacity-50" />
							<p>Start typing to search tasks</p>
							<p className="text-sm">Search by title or description</p>
						</div>
					) : (
						<CommandEmpty>
							{isLoading ? (
								<div className="flex items-center justify-center py-6">
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
									<span className="ml-2 text-muted-foreground">Loading tasks...</span>
								</div>
							) : (
								<div className="py-6 text-center text-muted-foreground">
									<Search className="mx-auto mb-2 h-8 w-8 opacity-50" />
									<p>No tasks found matching "{searchQuery}"</p>
									<p className="text-sm">Try searching with different keywords</p>
								</div>
							)}
						</CommandEmpty>
					)}

					{filteredTasks.length > 0 && (
						<CommandGroup
							heading={`${filteredTasks.length} task${filteredTasks.length === 1 ? '' : 's'} found`}
						>
							{filteredTasks.map((task) => (
								<CommandItem
									key={task.id}
									value={`${task.title} ${task.description || ''}`}
									onSelect={() => handleTaskSelect(task)}
									className="flex items-start gap-3 p-3"
								>
									<div className="mt-0.5 flex-shrink-0">{getStatusIcon(task.status_id)}</div>
									<div className="min-w-0 flex-1">
										<div className="mb-1 flex items-center gap-2">
											<FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
											<span className="truncate font-medium">{task.title}</span>
										</div>
										{task.description && (
											<p className="mb-1 line-clamp-2 text-muted-foreground text-sm">
												{task.description}
											</p>
										)}
										<div className="flex items-center gap-2 text-muted-foreground text-xs">
											<Calendar className="h-3 w-3" />
											<span>Created {formatDate(task.created_at)}</span>
										</div>
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					)}
				</CommandList>
			</CommandDialog>

			<TaskDetailDialog
				taskId={selectedTaskId}
				open={!!selectedTaskId}
				onOpenChange={(open) => !open && setSelectedTaskId(null)}
			/>
		</>
	)
}
