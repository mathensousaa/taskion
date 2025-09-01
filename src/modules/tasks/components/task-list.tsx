'use client'

import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Task, TasksReorderInput } from '@/backend/tasks/validation/task.schema'
import { tasksService } from '@/modules/tasks/services/tasks.service'
import { EmptyState } from './empty-state'
import { ErrorState } from './error-state'
import { LoadingState } from './loading-state'
import { SortableTaskCard } from './sortable-task-card'

interface TaskListProps {
	searchQuery?: string
	onTaskCreated?: (task: Task) => void
}

export function TaskList({ searchQuery = '', onTaskCreated }: TaskListProps) {
	const [tasks, setTasks] = useState<Task[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [hasMore, setHasMore] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [cursor, setCursor] = useState<
		{ order: number; created_at: string; id: string } | undefined
	>()
	const { ref: loadMoreRef, inView } = useInView()
	const abortControllerRef = useRef<AbortController | null>(null)

	const loadTasks = useCallback(
		async (isInitial = false) => {
			if (isInitial) {
				setIsLoading(true)
				setError(null)
			} else {
				setIsLoadingMore(true)
			}

			try {
				// Cancel previous request if it exists
				if (abortControllerRef.current) {
					abortControllerRef.current.abort()
				}

				abortControllerRef.current = new AbortController()

				const response = await tasksService.list(20, cursor)
				if (response) {
					const newTasks = response.data

					if (isInitial) {
						setTasks(newTasks)
					} else {
						setTasks((prev) => [...prev, ...newTasks])
					}

					setHasMore(response.hasMore)
					setCursor(response.nextCursor)
				}
			} catch (error: any) {
				if (error.name === 'AbortError') return

				console.error('Failed to load tasks:', error)
				setError('Failed to load tasks. Please try again.')
			} finally {
				setIsLoading(false)
				setIsLoadingMore(false)
			}
		},
		[cursor],
	)

	const loadMoreTasks = useCallback(() => {
		if (hasMore && !isLoadingMore && !isLoading) {
			loadTasks(false)
		}
	}, [hasMore, isLoadingMore, isLoading, loadTasks])

	// Load initial tasks
	useEffect(() => {
		loadTasks(true)
	}, [loadTasks])

	// Load more tasks when scrolling
	useEffect(() => {
		if (inView) {
			loadMoreTasks()
		}
	}, [inView, loadMoreTasks])

	// Cleanup abort controller on unmount
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort()
			}
		}
	}, [])

	const handleTaskUpdate = useCallback((updatedTask: Task) => {
		setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
	}, [])

	const handleTaskDelete = useCallback((taskId: string) => {
		setTasks((prev) => prev.filter((task) => task.id !== taskId))
	}, [])

	const handleTaskReorder = useCallback(
		async (taskId: string, newOrder: number) => {
			// Optimistically update the UI
			const updatedTasks = [...tasks]
			const taskIndex = updatedTasks.findIndex((task) => task.id === taskId)

			if (taskIndex === -1) return

			const task = updatedTasks[taskIndex]
			const oldOrder = task.order

			// Remove task from current position
			updatedTasks.splice(taskIndex, 1)

			// Find new position based on new order
			let newIndex = 0
			for (let i = 0; i < updatedTasks.length; i++) {
				if (updatedTasks[i].order >= newOrder) {
					break
				}
				newIndex = i + 1
			}

			// Insert task at new position
			updatedTasks.splice(newIndex, 0, { ...task, order: newOrder })

			// Update orders for affected tasks
			let currentOrder = 0
			updatedTasks.forEach((t, index) => {
				if (t.id !== taskId) {
					updatedTasks[index] = { ...t, order: currentOrder }
					currentOrder++
				} else {
					currentOrder++
				}
			})

			setTasks(updatedTasks)

			// Send reorder request to backend
			try {
				const reorderData: TasksReorderInput = [{ taskId, newOrder }]
				await tasksService.reorder(reorderData)
			} catch (error) {
				console.error('Failed to reorder tasks:', error)
				// Revert on error
				loadTasks(true)
			}
		},
		[tasks, loadTasks],
	)

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	const handleDragEnd = useCallback(
		(event: any) => {
			const { active, over } = event

			if (active.id !== over.id) {
				const oldIndex = tasks.findIndex((task) => task.id === active.id)
				const newIndex = tasks.findIndex((task) => task.id === over.id)

				if (oldIndex !== -1 && newIndex !== -1) {
					handleTaskReorder(tasks[oldIndex].id, newIndex)
				}
			}
		},
		[tasks, handleTaskReorder],
	)

	const handleTaskCreated = useCallback(
		(newTask: Task) => {
			setTasks((prev) => [newTask, ...prev])
			onTaskCreated?.(newTask)
		},
		[onTaskCreated],
	)

	// Filter tasks based on search query
	const filteredTasks = searchQuery
		? tasks.filter(
				(task) =>
					task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					(task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())),
			)
		: tasks

	if (isLoading) {
		return <LoadingState />
	}

	if (error) {
		return <ErrorState error={error} onRetry={() => loadTasks(true)} />
	}

	if (tasks.length === 0) {
		return <EmptyState onTaskCreated={handleTaskCreated} />
	}

	return (
		<div className="space-y-4 rounded-lg bg-secondary/50 p-4">
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext
					items={filteredTasks.map((task) => task.id)}
					strategy={verticalListSortingStrategy}
				>
					<div className="space-y-3">
						{filteredTasks.map((task) => (
							<SortableTaskCard
								key={task.id}
								task={task}
								onUpdate={handleTaskUpdate}
								onDelete={handleTaskDelete}
								onReorder={handleTaskReorder}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>

			{/* Load More Trigger */}
			{hasMore && (
				<div ref={loadMoreRef} className="py-4 text-center">
					{isLoadingMore && (
						<div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
							Loading more tasks...
						</div>
					)}
				</div>
			)}

			{/* No more tasks */}
			{!hasMore && tasks.length > 0 && (
				<div className="py-4 text-center text-muted-foreground text-sm">No more tasks to load</div>
			)}
		</div>
	)
}
