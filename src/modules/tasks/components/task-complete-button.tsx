import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { TaskStatus } from '@/backend/task-status/validation/task-status.schema'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { taskStatusService } from '@/modules/task-status/services/task-status.service'

interface TaskCompleteButtonProps {
	taskStatusId: string
}

export function TaskCompleteButton({ taskStatusId }: TaskCompleteButtonProps) {
	const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null)

	useEffect(() => {
		async function fetchStatus() {
			try {
				const taskStatus = await taskStatusService.getById(taskStatusId)
				setTaskStatus(taskStatus)
			} catch (error) {
				console.error('Failed to load task status:', error)
				setTaskStatus(null)
			}
		}

		fetchStatus()
	}, [taskStatusId])

	return (
		<Button
			variant="secondary"
			className={cn(
				'rounded-full text-muted-foreground',
				taskStatus?.slug === 'done' && 'bg-green-500 text-primary-foreground',
			)}
			size="icon"
		>
			<Check className="size-6 stroke-4" />
		</Button>
	)
}
