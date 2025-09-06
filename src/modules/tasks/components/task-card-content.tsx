import type { UseFormReturn } from 'react-hook-form'
import type { Task } from '@/backend/tasks/validation/task.schema'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import TaskStatusToggleButton from '@/modules/tasks/components/task-status-toggle-button'
import { TaskTitleEditor } from '@/modules/tasks/components/task-title-editor'
import { TaskDescriptionEditor } from './task-description-editor'

interface TaskCardContentProps {
	task: Task
	taskStatusSlug?: string
	isEditingTitle: boolean
	isEditingDescription: boolean
	isUpdating: boolean
	description: string | null
	titleForm: UseFormReturn<{ title: string }>
	titleInputRef: React.RefObject<HTMLInputElement | null>
	descriptionTextareaRef: React.RefObject<HTMLTextAreaElement | null>
	onTitleEdit: () => void
	onDescriptionEdit: () => void
	onTitleSave: (values: { title: string }) => void
	onDescriptionSave: () => void
	onDescriptionChange: (value: string) => void
	onKeyDown: (e: React.KeyboardEvent, isTitle: boolean) => void
	onClick: (e: React.MouseEvent) => void
	onDoubleClick: (e: React.MouseEvent) => void
	className?: string
}

export function TaskCardContent({
	task,
	taskStatusSlug,
	isEditingTitle,
	isEditingDescription,
	isUpdating,
	description,
	titleForm,
	titleInputRef,
	descriptionTextareaRef,
	onTitleEdit,
	onDescriptionEdit,
	onTitleSave,
	onDescriptionSave,
	onDescriptionChange,
	onKeyDown,
	onClick,
	onDoubleClick,
	className,
}: TaskCardContentProps) {
	return (
		<Card
			className={cn(
				'group relative grow cursor-pointer gap-3 overflow-hidden rounded-lg border bg-card p-3 shadow-none transition-all hover:shadow-md',
				className,
			)}
			onClick={onClick}
			onDoubleClick={onDoubleClick}
		>
			<div className="flex items-center gap-2 overflow-hidden">
				<TaskStatusToggleButton taskId={task.id} taskStatusId={task.status_id} />
				<div className="w-full min-w-0 max-w-full grow overflow-hidden">
					<TaskTitleEditor
						task={task}
						taskStatusSlug={taskStatusSlug}
						isEditing={isEditingTitle}
						isUpdating={isUpdating}
						titleForm={titleForm}
						titleInputRef={titleInputRef}
						onEdit={onTitleEdit}
						onSave={onTitleSave}
						onKeyDown={onKeyDown}
					/>
				</div>
			</div>

			{/* Task Content */}
			<div className="space-y-3">
				{/* Description */}
				{description && (
					<div className="min-h-[20px]">
						<TaskDescriptionEditor
							description={description}
							isEditing={isEditingDescription}
							isUpdating={isUpdating}
							descriptionTextareaRef={descriptionTextareaRef}
							onEdit={onDescriptionEdit}
							onSave={onDescriptionSave}
							onChange={onDescriptionChange}
							onKeyDown={onKeyDown}
						/>
					</div>
				)}

				{/* Quick Add Description */}
				{!description && !isEditingDescription && (
					<TaskDescriptionEditor
						description={description}
						isEditing={isEditingDescription}
						isUpdating={isUpdating}
						descriptionTextareaRef={descriptionTextareaRef}
						onEdit={onDescriptionEdit}
						onSave={onDescriptionSave}
						onChange={onDescriptionChange}
						onKeyDown={onKeyDown}
					/>
				)}
			</div>
		</Card>
	)
}
