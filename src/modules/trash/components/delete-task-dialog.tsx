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

interface DeleteTaskDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	taskTitle: string
	onConfirm: () => void
	isDeleting: boolean
}

export function DeleteTaskDialog({
	open,
	onOpenChange,
	taskTitle,
	onConfirm,
	isDeleting,
}: DeleteTaskDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Trash2 className="h-5 w-5 text-destructive" />
						Permanently Delete Task
					</DialogTitle>
					<DialogDescription>
						Are you sure you want to permanently delete "{taskTitle}"? This action cannot be undone
						and the task will be completely removed from the system.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
						{isDeleting ? 'Deleting...' : 'Permanently Delete'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
