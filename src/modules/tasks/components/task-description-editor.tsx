import { Loader2 } from 'lucide-react'
import Markdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { truncateToWords } from '@/lib/utils'

interface TaskDescriptionEditorProps {
	description: string | null
	isEditing: boolean
	isUpdating: boolean
	descriptionTextareaRef: React.RefObject<HTMLTextAreaElement | null>
	onEdit: () => void
	onSave: () => void
	onChange: (value: string) => void
	onKeyDown: (e: React.KeyboardEvent, isTitle: boolean) => void
}

export function TaskDescriptionEditor({
	description,
	isEditing,
	isUpdating,
	descriptionTextareaRef,
	onEdit,
	onSave,
	onChange,
	onKeyDown,
}: TaskDescriptionEditorProps) {
	if (isEditing) {
		return (
			<div className="space-y-2">
				<Textarea
					ref={descriptionTextareaRef}
					value={description || ''}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={(e) => onKeyDown(e, false)}
					onBlur={onSave}
					placeholder="Add description"
					className="min-h-[60px] resize-none text-sm"
					disabled={isUpdating}
				/>
				{isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
			</div>
		)
	}

	if (description) {
		return (
			<div className="text-muted-foreground text-xs">
				<Markdown>{truncateToWords(description, 5)}</Markdown>
			</div>
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
			className="px-1 text-muted-foreground/60 text-xs transition-colors hover:bg-accent/50 hover:text-muted-foreground"
		>
			+ Add description
		</Button>
	)
}
