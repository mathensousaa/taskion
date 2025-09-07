'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '@/backend/tasks/validation/task.schema'
import { TaskCard } from './task-card'

interface SortableTaskCardProps {
	task: Task
	onTaskClick?: (taskId: string) => void
	isReordering?: boolean
}

export function SortableTaskCard({
	task,
	onTaskClick,
	isReordering = false,
}: SortableTaskCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: task.id,
	})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div ref={setNodeRef} style={style} className={isReordering ? 'opacity-75' : ''}>
			<TaskCard
				task={task}
				isDragging={isDragging}
				dragHandleProps={{ ...attributes, ...listeners }}
				onTaskClick={onTaskClick}
			/>
		</div>
	)
}
