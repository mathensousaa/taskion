import { useCallback } from 'react'
import type { Task } from '@/backend/tasks/validation/task.schema'
import { useDeleteTask } from '@/modules/tasks/services'
import { showTaskDeleteError, showTaskDeleteSuccess } from '@/modules/tasks/utils'

interface UseTaskDeletionProps {
	task: Task
}

export function useTaskDeletion({ task }: UseTaskDeletionProps) {
	const { mutate: deleteTask } = useDeleteTask(task.id)

	const handleDelete = useCallback(() => {
		deleteTask(undefined, {
			onSuccess: () => {
				showTaskDeleteSuccess(task.title)
			},
			onError: (error) => {
				showTaskDeleteError(error)
			},
		})
	}, [deleteTask, task.title])

	return {
		handleDelete,
	}
}
