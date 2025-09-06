import { useCallback } from 'react'
import { useUpdateTaskStatusBySlug } from '@/modules/tasks/services'
import { showStatusUpdateError, showStatusUpdateSuccess } from '@/modules/tasks/utils'

interface UseTaskStatusProps {
	taskId: string
}

export function useTaskStatus({ taskId }: UseTaskStatusProps) {
	const { mutate: updateTaskStatus } = useUpdateTaskStatusBySlug(taskId)

	const handleStatusUpdate = useCallback(
		(statusSlug: string) => {
			updateTaskStatus(statusSlug, {
				onSuccess: () => {
					showStatusUpdateSuccess()
				},
				onError: (error) => {
					showStatusUpdateError(error)
				},
			})
		},
		[updateTaskStatus],
	)

	return {
		handleStatusUpdate,
	}
}
