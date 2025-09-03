'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Clock, Flag, Hash, Lock, Plus, Sparkles, Star, User } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Markdown from 'react-markdown'
import { toast } from 'sonner'
import { z } from 'zod'
import type { Task, TaskUpdateInput } from '@/backend/tasks/validation/task.schema'
import { QueryHandler } from '@/components/query-handler'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import TaskStatusToggleButton from '@/modules/tasks/components/task-status-toggle-button'
import { useEnhanceTask, useGetTaskById, useUpdateTask } from '@/modules/tasks/services'

const TaskTitleSchema = z.object({
	title: z
		.string()
		.min(1, 'Title is required.')
		.refine((title) => title.trim().split(/\s+/).length >= 3, {
			message: 'Please provide more details. Enter at least 3 words.',
		}),
})

type TaskTitleFormData = z.infer<typeof TaskTitleSchema>

interface TaskDetailDialogProps {
	taskId: string | null
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function TaskDetailDialog({ taskId, open, onOpenChange }: TaskDetailDialogProps) {
	const { data: task, status, error } = useGetTaskById(taskId || undefined)

	return (
		<Dialog open={open} onOpenChange={onOpenChange} modal>
			<DialogContent
				className="h-[80vh] w-full overflow-y-auto p-0 sm:max-w-7xl"
				showCloseButton={true}
			>
				<QueryHandler
					status={status}
					data={task}
					loadingComponent={<TaskDetailSkeleton />}
					errorComponent={<TaskDetailError error={error?.message || 'Failed to load task'} />}
					emptyComponent={<TaskDetailEmpty />}
					successComponent={task ? <TaskDetailContent task={task} /> : null}
				/>
			</DialogContent>
		</Dialog>
	)
}

function TaskDetailContent({ task }: { task: Task }) {
	const [isEditingTitle, setIsEditingTitle] = useState(false)
	const [showFadeIn, setShowFadeIn] = useState(false)
	const [previousTask, setPreviousTask] = useState<Task | null>(null)
	const titleInputRef = useRef<HTMLInputElement>(null)

	const { mutate: enhanceTask, isPending: isEnhancing } = useEnhanceTask(task.id, {
		onSuccess: () => {
			// Trigger fade-in animation
			setShowFadeIn(true)
			setTimeout(() => setShowFadeIn(false), 1000)

			toast.success('Task enhanced successfully!', {
				description: 'The task description has been improved with AI.',
			})
		},
		onError: (error) => {
			toast.error('Failed to enhance task', {
				description: error.message || 'An error occurred while enhancing the task.',
			})
		},
	})

	const { mutate: updateTask, isPending: isUpdating } = useUpdateTask(task.id)

	const titleForm = useForm<TaskTitleFormData>({
		resolver: zodResolver(TaskTitleSchema),
		defaultValues: {
			title: task.title,
		},
	})

	// Update form when task prop changes
	useEffect(() => {
		titleForm.reset({ title: task.title })
	}, [task.title, titleForm])

	// Track task changes for animation
	useEffect(() => {
		if (
			previousTask &&
			(previousTask.title !== task.title || previousTask.description !== task.description)
		) {
			setShowFadeIn(true)
			setTimeout(() => setShowFadeIn(false), 1000)
		}
		setPreviousTask(task)
	}, [task, previousTask])

	const handleTitleEdit = useCallback(() => {
		setIsEditingTitle(true)
		setTimeout(() => titleInputRef.current?.focus(), 0)
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
					toast.success('Task updated successfully!', {
						description: 'The task title has been updated.',
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

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				titleForm.handleSubmit(handleTitleSave)()
			} else if (e.key === 'Escape') {
				titleForm.reset({ title: task.title })
				setIsEditingTitle(false)
			}
		},
		[handleTitleSave, task.title, titleForm],
	)

	const handleEnhance = () => {
		enhanceTask()
	}

	return (
		<div className="flex h-full">
			{/* Left Panel - Main Content */}
			<div className="flex-1 space-y-6">
				{/* Task Title */}
				<div className="sticky top-0 space-y-2 border-b bg-background px-6 py-3">
					<div className="flex items-center gap-3">
						<TaskStatusToggleButton size="lg" taskId={task.id} taskStatusId={task.status_id} />
						{isEditingTitle ? (
							<Form {...titleForm}>
								<form onSubmit={titleForm.handleSubmit(handleTitleSave)} className="flex-1">
									<FormField
										control={titleForm.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														{...field}
														ref={titleInputRef}
														className="border-none bg-transparent p-0 font-bold font-serif text-2xl text-foreground leading-none shadow-none focus-visible:ring-0"
														onKeyDown={handleKeyDown}
														disabled={isUpdating}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</form>
							</Form>
						) : (
							<DialogTitle
								className={cn(
									'flex-1 cursor-pointer font-bold text-2xl text-foreground transition-all duration-500 ease-out hover:text-muted-foreground',
									showFadeIn && 'fade-in-0 slide-in-from-top-2 animate-in',
								)}
								onClick={handleTitleEdit}
							>
								{task.title}
							</DialogTitle>
						)}
					</div>
				</div>

				{/* Description */}
				<div
					className={cn(
						'space-y-2 px-6 py-3 transition-all duration-300',
						isEnhancing && 'animate-pulse rounded-lg bg-muted/20',
					)}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<div className="flex items-center gap-1">
								<div className="h-1 w-1 rounded-full bg-muted-foreground" />
								<div className="h-1 w-1 rounded-full bg-muted-foreground" />
								<div className="h-1 w-1 rounded-full bg-muted-foreground" />
							</div>
							<span>Description</span>
						</div>
						{task.description && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleEnhance}
								disabled={isEnhancing}
								className={cn(
									'h-7 text-muted-foreground text-xs transition-all duration-200 hover:text-foreground',
									isEnhancing && 'animate-pulse',
								)}
							>
								<Sparkles
									className={cn(
										'mr-1 h-3 w-3 transition-all duration-200',
										isEnhancing && 'animate-spin',
									)}
								/>
								{isEnhancing ? 'Enhancing...' : 'Enhance'}
							</Button>
						)}
					</div>
					{task.description ? (
						<div
							className={cn(
								'transition-all duration-500 ease-out',
								showFadeIn && 'fade-in-0 slide-in-from-bottom-2 animate-in',
							)}
						>
							<p className="text-foreground text-xs leading-relaxed">
								<Markdown>{task.description}</Markdown>
							</p>
						</div>
					) : (
						<p className="text-muted-foreground text-sm italic">No description</p>
					)}
				</div>

				{/* Subtasks */}
				<div className="space-y-2 px-6 py-3">
					<Button
						variant="ghost"
						size="sm"
						className="h-auto p-0 text-muted-foreground text-sm hover:text-foreground"
					>
						<Plus className="mr-2 h-4 w-4" />
						Adicionar subtarefa
					</Button>
					{/* Placeholder for subtasks - will be implemented later */}
					<div className="text-muted-foreground text-xs">No subtasks yet</div>
				</div>

				{/* Comments Section */}
				<div className="space-y-3 px-6 py-3">
					<Separator />
					<div className="flex items-start gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
							<User className="h-4 w-4 text-muted-foreground" />
						</div>
						<div className="flex-1">
							<div className="rounded-lg bg-muted/50 p-3">
								<input
									type="text"
									placeholder="Comentar"
									className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
									disabled
								/>
							</div>
						</div>
					</div>
					{/* Placeholder for comments - will be implemented later */}
					<div className="text-muted-foreground text-xs">No comments yet</div>
				</div>
			</div>

			{/* Right Panel - Metadata */}
			<div className="w-80 space-y-6 bg-muted/30 p-6">
				{/* Project */}
				<div className="space-y-2">
					<div className="font-medium text-muted-foreground text-xs">Projeto</div>
					<div className="flex items-center gap-2 text-sm">
						<Hash className="h-4 w-4 text-muted-foreground" />
						<span className="text-foreground">Meu trabalho</span>
						<User className="h-3 w-3 text-pink-500" />
						<span className="text-foreground">/</span>
						<span className="text-foreground">Rotinas</span>
						<Calendar className="h-3 w-3 text-blue-500" />
					</div>
				</div>

				{/* Date */}
				<div className="space-y-2">
					<div className="font-medium text-muted-foreground text-xs">Data</div>
					<div className="flex items-center gap-2 text-sm">
						<Calendar className="h-4 w-4 text-green-500" />
						<span className="text-foreground">Hoje 5 PM</span>
						<Clock className="h-3 w-3 text-muted-foreground" />
					</div>
				</div>

				{/* Deadline */}
				<div className="space-y-2">
					<div className="font-medium text-muted-foreground text-xs">Prazo</div>
					<div className="flex items-center gap-2 text-sm">
						<Star className="h-4 w-4 text-orange-500" />
						<Lock className="h-3 w-3 text-muted-foreground" />
					</div>
				</div>

				{/* Priority */}
				<div className="space-y-2">
					<div className="font-medium text-muted-foreground text-xs">Prioridade</div>
					<div className="flex items-center gap-2 text-sm">
						<Flag className="h-4 w-4 text-blue-500" />
						<span className="text-foreground">P3</span>
					</div>
				</div>

				{/* Labels */}
				<div className="space-y-2">
					<div className="font-medium text-muted-foreground text-xs">Etiquetas</div>
					<div className="flex items-center gap-2 text-sm">
						<Plus className="h-4 w-4 text-muted-foreground" />
					</div>
				</div>

				{/* Reminders */}
				<div className="space-y-2">
					<div className="font-medium text-muted-foreground text-xs">Lembretes</div>
					<div className="flex items-center gap-2 text-sm">
						<Star className="h-4 w-4 text-orange-500" />
						<span className="text-foreground">No horário da tarefa</span>
						<Clock className="h-3 w-3 text-muted-foreground" />
						<Lock className="h-3 w-3 text-muted-foreground" />
					</div>
				</div>

				{/* Location */}
				<div className="space-y-2">
					<div className="font-medium text-muted-foreground text-xs">Local</div>
					<div className="flex items-center gap-2 text-sm">
						<Star className="h-4 w-4 text-orange-500" />
						<Lock className="h-3 w-3 text-muted-foreground" />
					</div>
				</div>
			</div>
		</div>
	)
}

function TaskDetailSkeleton() {
	return (
		<div className="flex h-full">
			{/* Left Panel Skeleton */}
			<div className="flex-1 space-y-6 p-6">
				<div className="space-y-2">
					<Skeleton className="h-8 w-3/4" />
				</div>
				<div className="space-y-2">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-16 w-full" />
				</div>
				<div className="space-y-2">
					<Skeleton className="h-6 w-32" />
				</div>
				<div className="space-y-3">
					<Separator />
					<div className="flex items-start gap-3">
						<Skeleton className="h-8 w-8 rounded-full" />
						<Skeleton className="h-12 flex-1" />
					</div>
				</div>
			</div>

			{/* Right Panel Skeleton */}
			<div className="w-80 space-y-6 bg-muted/30 p-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i as React.Key}`} className="space-y-2">
						<Skeleton className="h-3 w-16" />
						<Skeleton className="h-4 w-24" />
					</div>
				))}
			</div>
		</div>
	)
}

function TaskDetailError({ error }: { error: string }) {
	return (
		<div className="flex h-full items-center justify-center p-6">
			<div className="space-y-2 text-center">
				<div className="font-medium text-destructive text-lg">Error loading task</div>
				<div className="text-muted-foreground text-sm">{error}</div>
			</div>
		</div>
	)
}

function TaskDetailEmpty() {
	return (
		<div className="flex h-full items-center justify-center p-6">
			<div className="space-y-2 text-center">
				<div className="font-medium text-foreground text-lg">Task not found</div>
				<div className="text-muted-foreground text-sm">
					The task you're looking for doesn't exist or has been deleted.
				</div>
			</div>
		</div>
	)
}
