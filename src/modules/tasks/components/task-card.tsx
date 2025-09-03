'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { GripVertical, Loader2, MoreHorizontal } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Markdown from 'react-markdown'
import { toast } from 'sonner'
import { z } from 'zod'
import type { Task, TaskUpdateInput } from '@/backend/tasks/validation/task.schema'
import { Highlighter } from '@/components/magicui/highlighter'
import { Button } from '@/components/ui/button'
import { Card, CardAction } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn, truncateToWords } from '@/lib/utils'
import { useGetTaskStatusById } from '@/modules/task-status/services'
import TaskStatusToggleButton from '@/modules/tasks/components/task-status-toggle-button'
import { useDeleteTask, useUpdateTask } from '@/modules/tasks/services'

const TaskTitleSchema = z.object({
	title: z
		.string()
		.min(1, 'Title is required.')
		.refine((title) => title.trim().split(/\s+/).length >= 3, {
			message: 'Please provide more details. Enter at least 3 words.',
		}),
})

type TaskTitleFormData = z.infer<typeof TaskTitleSchema>

interface TaskCardProps {
	task: Task
	isDragging?: boolean
	dragHandleProps?: Record<string, unknown>
	className?: string
}

// Utility function to truncate text to first N words

export function TaskCard({ task, isDragging, dragHandleProps, className }: TaskCardProps) {
	const [isEditingTitle, setIsEditingTitle] = useState(false)
	const [isEditingDescription, setIsEditingDescription] = useState(false)
	const [description, setDescription] = useState(task.description || '')
	const titleInputRef = useRef<HTMLInputElement>(null)
	const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null)

	const { data: taskStatus } = useGetTaskStatusById(task.status_id)

	const { mutate: updateTask, isPending: isUpdating } = useUpdateTask(task.id)

	const { mutate: deleteTask } = useDeleteTask(task.id)

	const titleForm = useForm<TaskTitleFormData>({
		resolver: zodResolver(TaskTitleSchema),
		defaultValues: {
			title: task.title,
		},
	})

	// Update form when task prop changes.
	useEffect(() => {
		titleForm.reset({ title: task.title })
		setDescription(task.description || '')
	}, [task.title, task.description, titleForm])

	const handleTitleEdit = useCallback(() => {
		setIsEditingTitle(true)
		setTimeout(() => titleInputRef.current?.focus(), 0)
	}, [])

	const handleDescriptionEdit = useCallback(() => {
		setIsEditingDescription(true)
		setTimeout(() => descriptionTextareaRef.current?.focus(), 0)
	}, [])

	const handleTitleSave = useCallback(
		(values: TaskTitleFormData) => {
			if (values.title.trim() === task.title) {
				setIsEditingTitle(false)
				return
			}

			const updateData: TaskUpdateInput = { title: values.title.trim() }
			updateTask(updateData, {
				onSuccess: () => {
					setIsEditingTitle(false)
					setIsEditingDescription(false)
					toast('Success!', {
						description: 'Tarefa atualizada com sucesso.',
					})
				},
				onError: (error) => {
					toast.error('Error updating task', {
						description: error.message,
					})
				},
			})
		},
		[task.title, updateTask],
	)

	const handleDescriptionSave = useCallback(() => {
		if (description === (task.description || '')) {
			setIsEditingDescription(false)
			return
		}

		const updateData: TaskUpdateInput = { description: description || undefined }
		updateTask(updateData, {
			onSuccess: () => {
				setIsEditingTitle(false)
				setIsEditingDescription(false)
				toast('Success!', {
					description: 'Tarefa atualizada com sucesso.',
				})
			},
			onError: (error) => {
				toast.error('Error updating task', {
					description: error.message,
				})
			},
		})
	}, [description, task.description, updateTask])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent, isTitle: boolean) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				if (isTitle) {
					titleForm.handleSubmit(handleTitleSave)()
				} else {
					handleDescriptionSave()
				}
			} else if (e.key === 'Escape') {
				if (isTitle) {
					titleForm.reset({ title: task.title })
					setIsEditingTitle(false)
				} else {
					setDescription(task.description || '')
					setIsEditingDescription(false)
				}
			}
		},
		[handleTitleSave, handleDescriptionSave, task.title, task.description, titleForm],
	)

	const handleDelete = useCallback(() => {
		deleteTask(undefined, {
			onSuccess: () => {
				toast('Success!', {
					description: (
						<span>
							Task <strong>"{task.title}"</strong> removed.
						</span>
					),
				})
			},
			onError: (error) => {
				toast.error('Error removing task', {
					description: error.message,
				})
			},
		})
	}, [deleteTask, task.title])

	const handleCardClick = useCallback(
		(e: React.MouseEvent) => {
			// Don't open dialog if user is editing or clicking on interactive elements
			if (isEditingTitle || isEditingDescription) return

			// Check if the click target is an interactive element
			const target = e.target as HTMLElement
			if (target.closest('button') || target.closest('input') || target.closest('textarea')) return
		},
		[isEditingTitle, isEditingDescription],
	)

	return (
		<div className="group relative w-full gap-1">
			<Button
				variant="ghost"
				size="icon"
				className="-left-8 absolute top-0 z-10 size-7 shrink-0 opacity-0 hover:cursor-grab group-hover:opacity-100"
				{...dragHandleProps}
			>
				<GripVertical className="size-4 shrink-0 text-muted-foreground" />
			</Button>
			<Card
				className={cn(
					'group relative grow cursor-pointer gap-3 rounded-lg border bg-card p-3 shadow-none transition-all hover:shadow-md',
					isDragging && 'opacity-50 shadow-lg',
					className,
				)}
				onClick={handleCardClick}
			>
				<div className="flex items-center gap-2">
					<TaskStatusToggleButton taskId={task.id} taskStatusId={task.status_id} />
					<div>
						{isEditingTitle ? (
							<Form {...titleForm}>
								<form
									onSubmit={titleForm.handleSubmit(handleTitleSave)}
									className="flex items-center gap-2"
								>
									<FormField
										control={titleForm.control}
										name="title"
										render={({ field }) => (
											<FormItem className="flex-1">
												<FormControl>
													<Input
														{...field}
														ref={titleInputRef}
														onKeyDown={(e) => handleKeyDown(e, true)}
														onBlur={titleForm.handleSubmit(handleTitleSave)}
														className="h-8 font-medium text-base"
														disabled={isUpdating}
													/>
												</FormControl>
												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>
									{isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
								</form>
							</Form>
						) : (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleTitleEdit}
								className="px-1 py-0.5 font-medium text-base transition-colors hover:bg-accent/50"
							>
								{taskStatus?.slug === 'done' ? (
									<Highlighter
										action="strike-through"
										strokeWidth={1.5}
										iterations={1}
										color="#c96442"
									>
										{task.title}
									</Highlighter>
								) : (
									task.title
								)}
							</Button>
						)}
					</div>
				</div>

				{/* Task Content */}
				<div className="space-y-3">
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
										placeholder="Add description"
										className="min-h-[60px] resize-none text-sm"
										disabled={isUpdating}
									/>
									{isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
								</div>
							) : (
								<span className="text-muted-foreground text-xs">
									<Markdown
									// onClick={handleDescriptionEdit}
									// className="cursor-pointer rounded px-1 py-0.5 text-muted-foreground text-sm transition-colors hover:bg-accent/50"
									>
										{truncateToWords(task.description, 5)}
									</Markdown>
								</span>
							)}
						</div>
					)}

					{/* Quick Add Description */}
					{!task.description && !isEditingDescription && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleDescriptionEdit}
							className="px-1 text-muted-foreground/60 text-xs transition-colors hover:bg-accent/50 hover:text-muted-foreground"
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
							<DropdownMenuItem variant="destructive" onClick={handleDelete}>
								Move to trash
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardAction>
			</Card>
		</div>
	)
}
