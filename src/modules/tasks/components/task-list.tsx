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
import { useState } from 'react'
import { QueryHandler } from '@/components/query-handler'
import { useListAllTasks } from '@/modules/tasks/services'
import { EmptyState } from './empty-state'
import { ErrorState } from './error-state'
import { LoadingState } from './loading-state'
import { NewTasksList } from './new-tasks-list'
import { SortableTaskCard } from './sortable-task-card'
import { TaskDetailDialog } from './task-detail-dialog'

interface TaskListProps {
	status?: string
}

export function TaskList({ status }: TaskListProps) {
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

	const { data: tasks, status: queryStatus, error, isLoading } = useListAllTasks({ status })

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	return (
		<>
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
						<NewTasksList />
					</div>
				}
				successComponent={
					<div className="space-y-4 rounded-lg">
						<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={() => {}}>
							<SortableContext
								items={tasks?.map((task) => task.id) || []}
								strategy={verticalListSortingStrategy}
							>
								<div className="space-y-3">
									{tasks?.map((task) => (
										<SortableTaskCard key={task.id} task={task} />
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

						{/* New Task Creation Flow */}
						<NewTasksList />
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
