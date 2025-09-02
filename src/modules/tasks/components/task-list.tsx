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
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Task } from '@/backend/tasks/validation/task.schema'
import { QueryHandler } from '@/components/query-handler'
import { useListTasks, useReorderTasks } from '@/modules/tasks/services'
import { EmptyState } from './empty-state'
import { ErrorState } from './error-state'
import { LoadingState } from './loading-state'
import { NewTasksList } from './new-tasks-list'
import { SortableTaskCard } from './sortable-task-card'
import { TaskDetailDialog } from './task-detail-dialog'

interface TaskListProps {
	searchQuery?: string
	onTaskCreated?: (task: Task) => void
}

export function TaskList({ searchQuery = '', onTaskCreated }: TaskListProps) {
	const [tasks, setTasks] = useState<Task[]>([])
	const [cursor, setCursor] = useState<
		{ order: number; created_at: string; id: string } | undefined
	>()
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
	const { ref: loadMoreRef, inView } = useInView()

	const { data, status, error } = useListTasks(20, cursor)
	const { mutate: reorderTasks } = useReorderTasks()

	// Update local tasks state when data changes
	useEffect(() => {
		if (data?.data) {
			if (cursor) {
				// Append new tasks for pagination
				setTasks((prev) => [...prev, ...data.data])
			} else {
				// Replace tasks for initial load
				setTasks(data.data)
			}
			setIsLoadingMore(false)
		}
	}, [data, cursor])

	const loadMoreTasks = useCallback(() => {
		if (data?.hasMore && status === 'success' && !isLoadingMore) {
			setIsLoadingMore(true)
			setCursor(data.nextCursor)
		}
	}, [data?.hasMore, data?.nextCursor, status, isLoadingMore])

	useEffect(() => {
		if (inView) {
			loadMoreTasks()
		}
	}, [inView, loadMoreTasks])

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event

			if (over && active.id !== over.id) {
				const oldIndex = tasks.findIndex((task) => task.id === active.id)
				const newIndex = tasks.findIndex((task) => task.id === over.id)

				if (oldIndex !== -1 && newIndex !== -1) {
					const reorderedTasks = arrayMove(tasks, oldIndex, newIndex)
					setTasks(reorderedTasks)

					// Call the reorder mutation
					reorderTasks(
						reorderedTasks.map((task, index) => ({
							taskId: task.id,
							newOrder: index,
						})),
					)
				}
			}
		},
		[tasks, reorderTasks],
	)

	const handleTaskCreated = useCallback(
		(newTask: Task) => {
			setTasks((prev) => [newTask, ...prev])
			onTaskCreated?.(newTask)
		},
		[onTaskCreated],
	)

	const handleTaskUpdate = useCallback((updatedTask: Task) => {
		setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
	}, [])

	const handleTaskDelete = useCallback((taskId: string) => {
		setTasks((prev) => prev.filter((task) => task.id !== taskId))
	}, [])

	const handleTaskClick = useCallback((taskId: string) => {
		setSelectedTaskId(taskId)
	}, [])

	// Filter tasks based on search query
	const filteredTasks = searchQuery
		? tasks.filter(
				(task) =>
					task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		: tasks

	return (
		<>
			<QueryHandler
				status={status}
				data={data}
				loadingComponent={<LoadingState />}
				errorComponent={
					<ErrorState
						error={error?.message || 'Failed to load tasks'}
						onRetry={() => window.location.reload()}
					/>
				}
				emptyComponent={
					<div className="space-y-4 rounded-lg">
						<EmptyState onTaskCreated={handleTaskCreated} />
						<NewTasksList onTaskCreated={handleTaskCreated} />
					</div>
				}
				successComponent={
					<div className="space-y-4 rounded-lg">
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
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
											onReorder={() => {}}
											onClick={handleTaskClick}
										/>
									))}
								</div>
							</SortableContext>
						</DndContext>

						{/* Load More Trigger */}
						{data?.hasMore && (
							<div ref={loadMoreRef} className="py-4 text-center">
								{isLoadingMore && (
									<div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
										Loading more tasks...
									</div>
								)}
							</div>
						)}

						{/* New Task Creation Flow */}
						<NewTasksList onTaskCreated={handleTaskCreated} />
					</div>
				}
			/>
			<TaskDetailDialog
				taskId={selectedTaskId}
				open={!!selectedTaskId}
				onOpenChange={(open) => !open && setSelectedTaskId(null)}
			/>
		</>
	)
}
