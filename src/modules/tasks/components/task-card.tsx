'use client'

import { GripVertical, Loader2, MoreHorizontal } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import type { Task, TaskUpdateInput } from '@/backend/tasks/validation/task.schema'
import { Button } from '@/components/ui/button'
import { Card, CardAction } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { TaskCompleteButton } from '@/modules/tasks/components/task-complete-button'
import { tasksService } from '@/modules/tasks/services/tasks.service'

interface TaskCardProps {
	task: Task
	onUpdate: (updatedTask: Task) => void
	onDelete: (taskId: string) => void
	onReorder: (taskId: string, newOrder: number) => void
	isDragging?: boolean
	dragHandleProps?: any
	className?: string
}

export function TaskCard({
	task,
	onUpdate,
	onDelete,
	onReorder,
	isDragging,
	dragHandleProps,
	className,
}: TaskCardProps) {
	const [isEditingTitle, setIsEditingTitle] = useState(false)
	const [isEditingDescription, setIsEditingDescription] = useState(false)
	const [title, setTitle] = useState(task.title)
	const [description, setDescription] = useState(task.description || '')
	const [isUpdating, setIsUpdating] = useState(false)
	const titleInputRef = useRef<HTMLInputElement>(null)
	const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null)

	// Update local state when task prop changes
	useEffect(() => {
		setTitle(task.title)
		setDescription(task.description || '')
	}, [task.title, task.description])

	const handleTitleEdit = useCallback(() => {
		setIsEditingTitle(true)
		setTimeout(() => titleInputRef.current?.focus(), 0)
	}, [])

	const handleDescriptionEdit = useCallback(() => {
		setIsEditingDescription(true)
		setTimeout(() => descriptionTextareaRef.current?.focus(), 0)
	}, [])

	const handleTitleSave = useCallback(async () => {
		if (title.trim() === task.title) {
			setIsEditingTitle(false)
			return
		}

		if (!title.trim()) {
			setTitle(task.title)
			setIsEditingTitle(false)
			return
		}

		setIsUpdating(true)
		try {
			const updateData: TaskUpdateInput = { title: title.trim() }
			const response = await tasksService.update(task.id, updateData)
			if (response) {
				onUpdate(response)
				setIsEditingTitle(false)
			}
		} catch (error) {
			console.error('Failed to update task title:', error)
			setTitle(task.title)
		} finally {
			setIsUpdating(false)
		}
	}, [title, task.title, task.id, onUpdate])

	const handleDescriptionSave = useCallback(async () => {
		if (description === (task.description || '')) {
			setIsEditingDescription(false)
			return
		}

		setIsUpdating(true)
		try {
			const updateData: TaskUpdateInput = { description: description || undefined }
			const response = await tasksService.update(task.id, updateData)
			if (response) {
				onUpdate(response)
				setIsEditingDescription(false)
			}
		} catch (error) {
			console.error('Failed to update task description:', error)
			setDescription(task.description || '')
		} finally {
			setIsUpdating(false)
		}
	}, [description, task.description, task.id, onUpdate])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent, isTitle: boolean) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				if (isTitle) {
					handleTitleSave()
				} else {
					handleDescriptionSave()
				}
			} else if (e.key === 'Escape') {
				if (isTitle) {
					setTitle(task.title)
					setIsEditingTitle(false)
				} else {
					setDescription(task.description || '')
					setIsEditingDescription(false)
				}
			}
		},
		[handleTitleSave, handleDescriptionSave, task.title, task.description],
	)

	const handleDelete = useCallback(async () => {
		try {
			await tasksService.delete(task.id)
			onDelete(task.id)
		} catch (error) {
			console.error('Failed to delete task:', error)
		}
	}, [task.id, onDelete])

	return (
		<Card
			className={cn(
				'group relative rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md',
				isDragging && 'opacity-50 shadow-lg',
				className,
			)}
			{...dragHandleProps}
		>
			<div className="flex items-center gap-2">
				<TaskCompleteButton taskStatusId={task.status_id} />
				<div className="min-h-[24px]">
					{isEditingTitle ? (
						<div className="flex items-center gap-2">
							<Input
								ref={titleInputRef}
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								onKeyDown={(e) => handleKeyDown(e, true)}
								onBlur={handleTitleSave}
								className="h-8 font-medium text-base"
								disabled={isUpdating}
							/>
							{isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
						</div>
					) : (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleTitleEdit}
							className="rounded px-1 py-0.5 font-medium text-base transition-colors hover:bg-accent/50"
						>
							{task.title}
						</Button>
					)}
				</div>
			</div>

			{/* Task Content */}
			<div className="space-y-3">
				{/* Title */}

				{/* Description */}
				{task.description && (
					<div className="min-h-[20px]">
						{isEditingDescription ? (
							<div className="space-y-2">
								<Textarea
									ref={descriptionTextareaRef}
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									onKeyDown={(e) => handleKeyDown(e, false)}
									onBlur={handleDescriptionSave}
									placeholder="Add description..."
									className="min-h-[60px] resize-none text-sm"
									disabled={isUpdating}
								/>
								{isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
							</div>
						) : (
							<Markdown
							// onClick={handleDescriptionEdit}
							// className="cursor-pointer rounded px-1 py-0.5 text-muted-foreground text-sm transition-colors hover:bg-accent/50"
							>
								{task.description}
							</Markdown>
						)}
					</div>
				)}

				{/* Quick Add Description */}
				{!task.description && !isEditingDescription && (
					<Button
						variant="ghost"
						size="sm"
						onClick={handleDescriptionEdit}
						className="rounded px-1 py-0.5 text-muted-foreground/60 text-sm transition-colors hover:bg-accent/50 hover:text-muted-foreground"
					>
						+ Add description
					</Button>
				)}
			</div>

			{/* Actions Menu */}
			<CardAction className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={handleTitleEdit}>Edit title</DropdownMenuItem>
						<DropdownMenuItem onClick={handleDescriptionEdit}>Edit description</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleDelete}
							className="text-destructive focus:text-destructive"
						>
							Delete task
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardAction>
		</Card>
	)
}
