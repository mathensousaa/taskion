import { useCallback } from 'react'
import { toast } from 'sonner'
import type { Task } from '@/backend/tasks/validation/task.schema'
import { useDeleteTask } from '@/modules/tasks/services'

interface UseTaskDeletionProps {
	task: Task
}

export function useTaskDeletion({ task }: UseTaskDeletionProps) {
	const { mutate: deleteTask } = useDeleteTask(task.id)

	const handleDelete = useCallback(() => {
		deleteTask(undefined, {
			onSuccess: () => {
				toast('Success!', {
					description: `Task "${task.title}" removed.`,
				})
			},
			onError: (error) => {
				toast.error('Error removing task', {
					description: error.message,
				})
			},
		})
	}, [deleteTask, task.title])

	return {
		handleDelete,
	}
}
