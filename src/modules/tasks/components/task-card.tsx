'use client'

import { GripVertical } from 'lucide-react'
import type { Task } from '@/backend/tasks/validation/task.schema'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useGetTaskStatusById, useListTaskStatuses } from '@/modules/task-status/services'
import { useTaskDeletion } from '../hooks/use-task-deletion'
import { useTaskEditing } from '../hooks/use-task-editing'
import { useTaskInteractions } from '../hooks/use-task-interactions'
import { useTaskStatus } from '../hooks/use-task-status'
import { TaskActionsDropdown, TaskActionsMenu } from './task-actions-menu'
import { TaskCardContent } from './task-card-content'

interface TaskCardProps {
	task: Task
	isDragging?: boolean
	dragHandleProps?: Record<string, unknown>
	className?: string
	onTaskClick?: (taskId: string) => void
}

export function TaskCard({
	task,
	isDragging,
	dragHandleProps,
	className,
	onTaskClick,
}: TaskCardProps) {
	const { data: taskStatus } = useGetTaskStatusById(task.status_id)
	const { data: taskStatuses } = useListTaskStatuses()

	// Custom hooks for different concerns
	const editing = useTaskEditing({ task })
	const status = useTaskStatus({ taskId: task.id })
	const deletion = useTaskDeletion({ task })
	const interactions = useTaskInteractions({
		taskId: task.id,
		onTaskClick,
		handleStatusUpdate: status.handleStatusUpdate,
		taskStatusSlug: taskStatus?.slug,
		isEditing: editing.isEditingTitle || editing.isEditingDescription,
	})

	return (
		<div className="group relative w-full gap-1">
			{/* Drag Handle */}
			<Button
				variant="ghost"
				size="icon"
				className="-left-8 absolute top-0 z-10 size-7 shrink-0 opacity-0 hover:cursor-grab group-hover:opacity-100"
				onClick={(e) => e.stopPropagation()}
				{...dragHandleProps}
			>
				<GripVertical className="size-4 shrink-0 text-muted-foreground" />
			</Button>

			{/* Task Card with Context Menu */}
			<TaskActionsMenu
				taskStatuses={taskStatuses}
				onEditTitle={editing.handleTitleEdit}
				onStatusUpdate={status.handleStatusUpdate}
				onDelete={deletion.handleDelete}
			>
				<TaskCardContent
					task={task}
					taskStatusSlug={taskStatus?.slug}
					isEditingTitle={editing.isEditingTitle}
					isEditingDescription={editing.isEditingDescription}
					isUpdating={editing.isUpdating}
					description={editing.description}
					titleForm={editing.titleForm}
					titleInputRef={editing.titleInputRef}
					descriptionTextareaRef={editing.descriptionTextareaRef}
					onTitleEdit={editing.handleTitleEdit}
					onDescriptionEdit={editing.handleDescriptionEdit}
					onTitleSave={editing.handleTitleSave}
					onDescriptionSave={editing.handleDescriptionSave}
					onDescriptionChange={editing.setDescription}
					onKeyDown={editing.handleKeyDown}
					onClick={(e) => {
						// Only handle left clicks for task dialog
						if (e.button === 0) {
							interactions.handleCardClick(e)
						}
					}}
					onDoubleClick={interactions.handleDoubleClick}
					className={cn(
						isDragging && 'opacity-50 shadow-lg',
						taskStatus?.slug === 'in_progress' && 'border-l-4 border-l-primary',
						className,
					)}
				/>
			</TaskActionsMenu>

			{/* Dropdown Actions */}
			<TaskActionsDropdown
				taskStatuses={taskStatuses}
				onEditTitle={editing.handleTitleEdit}
				onStatusUpdate={status.handleStatusUpdate}
				onDelete={deletion.handleDelete}
			/>
		</div>
	)
}
