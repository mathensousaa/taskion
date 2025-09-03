'use client'

import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import type { TaskCreationInput } from '@/backend/tasks/validation/task.schema'
import { Button } from '@/components/ui/button'
import { useCreateTask } from '@/modules/tasks/services'
import { NewTaskCard } from './new-task-card'

interface PendingTask {
	id: string
	data: TaskCreationInput
	isSubmitting: boolean
}

export function NewTasksList() {
	const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([])
	const [showAddButton, setShowAddButton] = useState(true)

	const { mutate: createTask } = useCreateTask({
		onSuccess: (newTask) => {
			toast('Success!', {
				description: (
					<span>
						Task <strong>"{newTask.title}"</strong> created.
					</span>
				),
			})
		},
		onError: (error) => {
			toast.error('Error creating task', {
				description: error.message,
			})
		},
	})

	const handleAddTask = useCallback(() => {
		const newPendingTask: PendingTask = {
			id: `pending-${Date.now()}-${Math.random()}`,
			data: { title: '' },
			isSubmitting: false,
		}

		setPendingTasks((prev) => [...prev, newPendingTask])
		setShowAddButton(false)
	}, [])

	const handleTaskSubmit = useCallback(
		async (pendingTaskId: string, data: TaskCreationInput) => {
			// Mark the task as submitting.
			setPendingTasks((prev) =>
				prev.map((task) => (task.id === pendingTaskId ? { ...task, isSubmitting: true } : task)),
			)

			createTask(data, {
				onSuccess: (newTask) => {
					// Remove the pending task and add the real task.
					setPendingTasks((prev) => prev.filter((task) => task.id !== pendingTaskId))
					setShowAddButton(true)
				},
				onError: () => {
					// Reset the pending task to allow retry.
					setPendingTasks((prev) =>
						prev.map((task) =>
							task.id === pendingTaskId ? { ...task, isSubmitting: false } : task,
						),
					)
				},
			})
		},
		[createTask],
	)

	const handleTaskCancel = useCallback((pendingTaskId: string) => {
		setPendingTasks((prev) => prev.filter((task) => task.id !== pendingTaskId))
		setShowAddButton(true)
	}, [])

	return (
		<div className="space-y-3">
			{/* Pending Tasks. */}
			{pendingTasks.map((pendingTask) => (
				<NewTaskCard
					key={pendingTask.id}
					onSubmit={(data) => handleTaskSubmit(pendingTask.id, data)}
					onCancel={() => handleTaskCancel(pendingTask.id)}
					isSubmitting={pendingTask.isSubmitting}
				/>
			))}

			{/* Add Task Button. */}
			{showAddButton && (
				<Button
					variant="outline"
					onClick={handleAddTask}
					className="h-12 w-full border-2 border-dashed transition-all hover:border-solid"
				>
					<Plus className="mr-2 h-4 w-4" />
					Add Task
				</Button>
			)}
		</div>
	)
}
