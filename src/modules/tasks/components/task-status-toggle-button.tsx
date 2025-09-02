import { Check } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useGetTaskStatusById } from '@/modules/task-status/services'
import { useToggleTaskStatus } from '@/modules/tasks/services'

interface TaskStatusToggleButtonProps {
	taskId: string
	taskStatusId: string | undefined
	onStatusChange?: () => void
}

export default function TaskStatusToggleButton({
	taskId,
	taskStatusId,
}: TaskStatusToggleButtonProps) {
	const { data: taskStatus } = useGetTaskStatusById(taskStatusId)
	const { mutate: toggleStatus, isPending } = useToggleTaskStatus(taskId)

	const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null)

	const playFlopSound = useCallback(() => {
		try {
			const audio = new Audio('/flop.mp3')
			audio.play().catch((error) => {
				console.error('Failed to play sound:', error)
			})
		} catch (error) {
			console.error('Failed to create audio element:', error)
		}
	}, [])

	const handleClick = useCallback(() => {
		if (!taskStatusId || !taskId) return

		const currentSlug = taskStatus?.slug
		const newSlug = currentSlug === 'done' ? 'not-started' : 'done'
		setOptimisticStatus(newSlug)

		if (currentSlug !== 'done') {
			playFlopSound()
		}

		toggleStatus()
	}, [taskStatusId, taskId, taskStatus?.slug, playFlopSound, toggleStatus])

	const displayStatus = optimisticStatus || taskStatus?.slug

	return (
		<Button
			variant="secondary"
			className={cn(
				'size-5 rounded-full text-muted-foreground',
				displayStatus === 'done' && 'bg-green-500 text-primary-foreground hover:bg-green-500',
				!taskStatusId && 'opacity-50',
			)}
			size="icon"
			disabled={!taskStatusId || !taskId || isPending}
			onClick={handleClick}
		>
			<Check className="size-3 stroke-4" />
		</Button>
	)
}
