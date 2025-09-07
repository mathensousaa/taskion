'use client'

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import type { Task } from '@/backend/tasks/validation/task.schema'
import { QueryHandler } from '@/components/query-handler'
import { queryClient } from '@/lib/react-query'
import { useListAllTasks, useReorderTaskBetween } from '@/modules/tasks/services'
import { EmptyState } from './empty-state'
import { ErrorState } from './error-state'
import { LoadingState } from './loading-state'
import { NewTasksList } from './new-tasks-list'
import { SortableTaskCard } from './sortable-task-card'

interface TaskListProps {
	status?: string
}

export function TaskList({ status }: TaskListProps) {
	const router = useRouter()

	const { data: tasks, status: queryStatus, error, isLoading } = useListAllTasks({ status })
	const [reorderingTaskId, setReorderingTaskId] = useState<string | null>(null)

	const { mutate: reorderTaskBetween } = useReorderTaskBetween({
		onMutate: async (reorderData) => {
			await queryClient.cancelQueries({
				predicate: (query) => query.queryKey[0] === 'tasks' && query.queryKey[1] === '#all',
			})

			// Snapshot the previous value
			const previousTasks = queryClient.getQueryData(['tasks', '#all'])

			// Optimistically update to the new value
			if (previousTasks && Array.isArray(previousTasks)) {
				const { taskId, previousTaskId, nextTaskId } = reorderData

				// Set the reordering state
				setReorderingTaskId(taskId)

				// Find the task being reordered
				const taskIndex = previousTasks.findIndex((task: Task) => task.id === taskId)
				if (taskIndex !== -1) {
					// Create a new array with the task moved to its new position
					const newTasks = [...previousTasks]
					const taskToMove = newTasks.splice(taskIndex, 1)[0]

					// Find the new position based on previousTaskId and nextTaskId
					let newIndex = 0
					if (previousTaskId) {
						const prevIndex = newTasks.findIndex((task: Task) => task.id === previousTaskId)
						if (prevIndex !== -1) {
							newIndex = prevIndex + 1
						}
					} else if (nextTaskId) {
						const nextIndex = newTasks.findIndex((task: Task) => task.id === nextTaskId)
						if (nextIndex !== -1) {
							newIndex = nextIndex
						}
					}

					// Insert the task at the new position
					newTasks.splice(newIndex, 0, taskToMove)

					// Generate a temporary order for the moved task (simple timestamp-based)
					const tempOrder = `temp-${Date.now()}-${Math.random()}`
					newTasks[newIndex] = {
						...newTasks[newIndex],
						order: tempOrder,
					}

					// Optimistically update the cache
					queryClient.setQueryData(['tasks', '#all'], newTasks)
				}
			}

			// Return a context object with the snapshotted value
			return { previousTasks }
		},
		onError: (_err, _reorderData, context) => {
			// If the mutation fails, use the context returned from onMutate to roll back
			if (context && typeof context === 'object' && 'previousTasks' in context) {
				queryClient.setQueryData(
					['tasks', '#all'],
					(context as { previousTasks: Task[] }).previousTasks,
				)
			}
			setReorderingTaskId(null) // Clear reordering state
			toast.error('Failed to reorder task', {
				description: 'Please try again.',
			})
		},
		onSuccess: () => {
			setReorderingTaskId(null) // Clear reordering state
			toast.success('Task reordered successfully')
		},
		onSettled: () => {
			// Always refetch after error or success
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0] === 'tasks' && query.queryKey[1] === '#all',
			})
		},
	})

	const handleTaskClick = (taskId: string) => {
		// Navigate to the same page with task query parameter
		router.push(`/?task=${taskId}`)
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (!over || !tasks) return

		const activeId = active.id as string
		const overId = over.id as string

		if (activeId === overId) return

		// Find the indices of the dragged and target tasks
		const activeIndex = tasks.findIndex((task) => task.id === activeId)
		const overIndex = tasks.findIndex((task) => task.id === overId)

		if (activeIndex === -1 || overIndex === -1) return

		// Determine the previous and next task IDs based on the drop position
		let previousTaskId: string | undefined
		let nextTaskId: string | undefined

		if (overIndex === 0) {
			// Dropped at the beginning
			nextTaskId = tasks[0].id
		} else if (overIndex >= tasks.length - 1) {
			// Dropped at the end
			previousTaskId = tasks[tasks.length - 1].id
		} else {
			// Dropped in the middle
			previousTaskId = tasks[overIndex - 1].id
			nextTaskId = tasks[overIndex].id
		}

		// Call the reorder mutation with minimal data
		reorderTaskBetween({
			taskId: activeId,
			previousTaskId,
			nextTaskId,
		})
	}

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	return (
		<QueryHandler
			status={queryStatus}
			data={tasks}
			loadingComponent={<LoadingState />}
			errorComponent={
				<ErrorState
					error={error?.message || 'Failed to load tasks'}
					onRetry={() => window.location.reload()}
				/>
			}
			emptyComponent={
				<div className="space-y-4 rounded-lg">
					<EmptyState />
					<NewTasksList key="empty-top" position="top" />
				</div>
			}
			successComponent={
				<div className="space-y-4 rounded-lg">
					<NewTasksList key="success-top" position="top" />
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={tasks?.map((task) => task.id) || []}
							strategy={verticalListSortingStrategy}
						>
							<div className="space-y-3">
								{tasks?.map((task) => (
									<SortableTaskCard
										key={task.id}
										task={task}
										onTaskClick={handleTaskClick}
										isReordering={reorderingTaskId === task.id}
									/>
								))}
							</div>
						</SortableContext>
					</DndContext>

					{/* Load More Trigger */}
					{isLoading && (
						<div className="py-4 text-center">
							{isLoading && (
								<div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
									Loading more tasks...
								</div>
							)}
						</div>
					)}

					<NewTasksList key="success-bottom" position="bottom" />
				</div>
			}
		/>
	)
}
