'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '@/backend/tasks/validation/task.schema'
import { TaskCard } from './task-card'

interface SortableTaskCardProps {
	task: Task
	onUpdate: (updatedTask: Task) => void
	onDelete: (taskId: string) => void
	onReorder: (taskId: string, newOrder: number) => void
}

export function SortableTaskCard({ task, onUpdate, onDelete, onReorder }: SortableTaskCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: task.id,
	})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div ref={setNodeRef} style={style}>
			<TaskCard
				task={task}
				onUpdate={onUpdate}
				onDelete={onDelete}
				onReorder={onReorder}
				isDragging={isDragging}
				dragHandleProps={{ ...attributes, ...listeners }}
			/>
		</div>
	)
}
