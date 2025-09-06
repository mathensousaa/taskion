import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { Task } from '@/backend/tasks/validation/task.schema'
import { Highlighter } from '@/components/magicui/highlighter'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface TaskTitleEditorProps {
	task: Task
	taskStatusSlug?: string
	isEditing: boolean
	isUpdating: boolean
	titleForm: UseFormReturn<{ title: string }>
	titleInputRef: React.RefObject<HTMLInputElement | null>
	onEdit: () => void
	onSave: (values: { title: string }) => void
	onKeyDown: (e: React.KeyboardEvent, isTitle: boolean) => void
}

export function TaskTitleEditor({
	task,
	taskStatusSlug,
	isEditing,
	isUpdating,
	titleForm,
	titleInputRef,
	onEdit,
	onSave,
	onKeyDown,
}: TaskTitleEditorProps) {
	useEffect(() => {
		if (isEditing) {
			titleInputRef.current?.focus()
		}
	}, [isEditing, titleInputRef])

	if (isEditing) {
		return (
			<Form {...titleForm}>
				<form onSubmit={titleForm.handleSubmit(onSave)} className="flex w-full items-center gap-2">
					<FormField
						control={titleForm.control}
						name="title"
						render={({ field }) => (
							<FormItem className="w-full flex-1">
								<FormControl>
									<Input
										{...field}
										ref={titleInputRef}
										onKeyDown={(e) => onKeyDown(e, true)}
										onBlur={titleForm.handleSubmit(onSave)}
										className="h-8 px-1 py-0.5 font-medium md:text-base"
										variant="transparent"
										disabled={isUpdating}
										autoCorrect="off"
									/>
								</FormControl>
								<FormMessage className="text-xs" />
							</FormItem>
						)}
					/>
					{isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
				</form>
			</Form>
		)
	}

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={(e) => {
				e.stopPropagation()
				onEdit()
			}}
			className="px-1 py-0.5 font-medium text-base transition-colors hover:bg-accent/50"
		>
			{taskStatusSlug === 'done' ? (
				<Highlighter action="strike-through" strokeWidth={1.5} iterations={1} color="#c96442">
					{task.title}
				</Highlighter>
			) : (
				task.title
			)}
		</Button>
	)
}
