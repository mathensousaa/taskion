'use client'

import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { TaskCreationInput } from '@/backend/tasks/validation/task.schema'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCreateTask } from '@/modules/tasks/services'
import { showTaskCreateError, showTaskCreateSuccess } from '@/modules/tasks/utils'
import { NewTaskCard } from './new-task-card'

interface PendingTask {
	id: string
	data: TaskCreationInput
	isSubmitting: boolean
	hasError?: boolean
	errorMessage?: string
	position: 'top' | 'bottom'
}

interface NewTasksListProps {
	position: 'top' | 'bottom'
}

export function NewTasksList({ position = 'top' }: NewTasksListProps) {
	const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([])
	const { mutate: createTask } = useCreateTask()

	const handleAddTask = useCallback(() => {
		const isAllTasksSubmitting = pendingTasks.every((task) => task.isSubmitting)

		if (!isAllTasksSubmitting) {
			return
		}

		const newPendingTask: PendingTask = {
			id: `pending-${Date.now()}-${Math.random()}`,
			data: { title: '', position },
			isSubmitting: false,
			position,
		}

		setPendingTasks((prev) => {
			const newTasks = [newPendingTask, ...prev]

			return newTasks
		})
	}, [position, pendingTasks])

	const handleTaskSubmit = useCallback(
		(pendingTaskId: string, data: TaskCreationInput) => {
			// Mark the task as submitting.
			setPendingTasks((prev) =>
				prev.map((task) => (task.id === pendingTaskId ? { ...task, isSubmitting: true } : task)),
			)

			createTask(data, {
				onSuccess: (newTask) => {
					setPendingTasks((prev) => {
						const filtered = prev.filter((task) => task.id !== pendingTaskId)
						return filtered
					})

					showTaskCreateSuccess(newTask.title)
				},
				onError: (error) => {
					// Set error state to allow retry.
					setPendingTasks((prev) =>
						prev.map((task) =>
							task.id === pendingTaskId
								? { ...task, isSubmitting: false, hasError: true, errorMessage: error.message }
								: task,
						),
					)
					showTaskCreateError(error)
				},
			})
		},
		[createTask],
	)

	const handleTaskCancel = useCallback((pendingTaskId: string) => {
		setPendingTasks((prev) => prev.filter((task) => task.id !== pendingTaskId))
	}, [])

	const handleTaskRetry = useCallback((pendingTaskId: string) => {
		// Reset error state and retry
		setPendingTasks((prev) =>
			prev.map((task) =>
				task.id === pendingTaskId
					? { ...task, isSubmitting: false, hasError: false, errorMessage: undefined }
					: task,
			),
		)
	}, [])

	return (
		<div className={cn('flex flex-col gap-3', position === 'bottom' && 'flex-col-reverse')}>
			<div className="flex gap-2">
				<Button
					variant="outline"
					onClick={handleAddTask}
					className="h-12 flex-1 border-2 border-dashed transition-all hover:border-solid"
				>
					<Plus className="mr-2 h-4 w-4" />
					Add Task
				</Button>
			</div>

			{pendingTasks.map((pendingTask) => (
				<NewTaskCard
					key={pendingTask.id}
					onSubmit={(data) => handleTaskSubmit(pendingTask.id, data)}
					onCancel={() => handleTaskCancel(pendingTask.id)}
					onRetry={() => handleTaskRetry(pendingTask.id)}
					isSubmitting={pendingTask.isSubmitting}
					hasError={pendingTask.hasError}
					errorMessage={pendingTask.errorMessage}
					position={pendingTask.position}
				/>
			))}
		</div>
	)
}
