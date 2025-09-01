import { CheckSquare } from 'lucide-react'
import type { Task } from '@/backend/tasks/validation/task.schema'
import { QuickCreateTask } from './quick-create-task'

interface EmptyStateProps {
	onTaskCreated: (task: Task) => void
}

export function EmptyState({ onTaskCreated }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="mb-6 rounded-full bg-muted p-4">
				<CheckSquare className="h-12 w-12 text-muted-foreground" />
			</div>

			<h3 className="mb-2 font-semibold text-xl">No tasks yet</h3>
			<p className="mb-6 max-w-md text-muted-foreground">
				Get started by creating your first task. You can add titles, descriptions, and organize them
				however you like.
			</p>

			<QuickCreateTask onTaskCreated={onTaskCreated} />

			<div className="mt-8 text-muted-foreground text-sm">
				<p>💡 Tip: Use the search bar above to find tasks quickly once you have some.</p>
			</div>
		</div>
	)
}
