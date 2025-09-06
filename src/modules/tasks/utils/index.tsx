import { toast } from 'sonner'

export const showTaskCreateSuccess = (taskTitle: string) => {
	toast.success('Success!', {
		description: (
			<span>
				Task <strong>"{taskTitle}"</strong> created.
			</span>
		),
	})
}

export const showTaskCreateError = (error: { message: string }) => {
	toast.error('Error creating task', {
		description: error.message,
	})
}

export const showTaskUpdateSuccess = () => {
	toast.success('Success!', {
		description: 'Task updated successfully.',
	})
}

export const showTaskUpdateError = (error: { message: string }) => {
	toast.error('Error updating task', {
		description: error.message,
	})
}

export const showStatusUpdateSuccess = () => {
	toast.success('Success!', {
		description: 'Task status updated successfully.',
	})
}

export const showStatusUpdateError = (error: { message: string }) => {
	toast.error('Error updating task status', {
		description: error.message,
	})
}

export const showTaskDeleteSuccess = (taskTitle: string) => {
	toast.success('Success!', {
		description: (
			<span>
				Task <strong>"{taskTitle}"</strong> removed.
			</span>
		),
	})
}

export const showTaskDeleteError = (error: { message: string }) => {
	toast.error('Error removing task', {
		description: error.message,
	})
}

export const showTaskEnhanceSuccess = () => {
	toast.success('Success!', {
		description: 'Task enhanced successfully.',
	})
}

export const showTaskEnhanceError = (error: { message: string }) => {
	toast.error('Error enhancing task', {
		description: error.message,
	})
}

export const isInteractiveElement = (target: HTMLElement): boolean => {
	return !!(
		target.closest('button') ||
		target.closest('input') ||
		target.closest('textarea') ||
		target.closest('[role="menuitem"]') ||
		target.closest('[data-radix-collection-item]') ||
		target.closest('[data-state="open"]') ||
		target.closest('[data-slot="context-menu"]')
	)
}
