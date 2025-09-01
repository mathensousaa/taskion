'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

interface EmptyTrashDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	taskCount: number
	onConfirm: () => void
	isEmptying: boolean
}

export function EmptyTrashDialog({
	open,
	onOpenChange,
	taskCount,
	onConfirm,
	isEmptying,
}: EmptyTrashDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Trash2 className="h-5 w-5 text-destructive" />
						Empty Trash
					</DialogTitle>
					<DialogDescription>
						Are you sure you want to permanently delete all {taskCount} task
						{taskCount === 1 ? '' : 's'} in the trash? This action cannot be undone and all tasks
						will be completely removed from the system.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isEmptying}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={onConfirm} disabled={isEmptying}>
						{isEmptying ? 'Emptying...' : 'Empty Trash'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
