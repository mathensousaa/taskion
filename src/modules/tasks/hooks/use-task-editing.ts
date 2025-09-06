import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Task, TaskUpdateInput } from '@/backend/tasks/validation/task.schema'
import { useUpdateTask } from '@/modules/tasks/services'
import { showTaskUpdateError, showTaskUpdateSuccess } from '@/modules/tasks/utils'

const TaskTitleSchema = z.object({
	title: z
		.string()
		.min(1, 'Title is required.')
		.refine((title) => title.trim().split(/\s+/).length >= 3, {
			message: 'Please provide more details. Enter at least 3 words.',
		}),
})

type TaskTitleFormData = z.infer<typeof TaskTitleSchema>

interface UseTaskEditingProps {
	task: Task
}

export function useTaskEditing({ task }: UseTaskEditingProps) {
	const [isEditingTitle, setIsEditingTitle] = useState(false)
	const [isEditingDescription, setIsEditingDescription] = useState(false)
	const [description, setDescription] = useState(task.description || '')

	const titleInputRef = useRef<HTMLInputElement | null>(null)
	const descriptionTextareaRef = useRef<HTMLTextAreaElement | null>(null)

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
		setDescription(task.description || '')
	}, [task.title, task.description, titleForm])

	const handleTitleEdit = useCallback(() => {
		setIsEditingTitle(true)

		requestAnimationFrame(() => {
			titleInputRef.current?.focus()
		})
	}, [])

	const handleDescriptionEdit = useCallback(() => {
		setIsEditingDescription(true)
		requestAnimationFrame(() => {
			descriptionTextareaRef.current?.focus()
		})
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
					showTaskUpdateSuccess()
				},
				onError: (error) => {
					showTaskUpdateError(error)
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
				showTaskUpdateSuccess()
			},
			onError: (error) => {
				showTaskUpdateError(error)
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

	return {
		// State
		isEditingTitle,
		isEditingDescription,
		description,
		setDescription,
		isUpdating,

		// Refs
		titleInputRef,
		descriptionTextareaRef,

		// Form
		titleForm,

		// Handlers
		handleTitleEdit,
		handleDescriptionEdit,
		handleTitleSave,
		handleDescriptionSave,
		handleKeyDown,
	}
}
