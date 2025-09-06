'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PageContent } from '@/components/ui/page'
import { TaskDetailDialog } from '@/modules/tasks/components/task-detail-dialog'
import { TaskListWithFilter } from '@/modules/tasks/components/task-list-with-filter'

export default function HomePage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

	// Watch for task query parameter
	useEffect(() => {
		const taskId = searchParams.get('task')
		setSelectedTaskId(taskId)
	}, [searchParams])

	const handleTaskDialogClose = (open: boolean) => {
		if (!open) {
			// Remove the task query parameter when dialog closes
			const newSearchParams = new URLSearchParams(searchParams.toString())
			newSearchParams.delete('task')
			const newUrl = newSearchParams.toString()
				? `?${newSearchParams.toString()}`
				: window.location.pathname
			router.replace(newUrl)
			setSelectedTaskId(null)
		}
	}

	return (
		<PageContent className="p-6">
			<div className="space-y-6">
				<TaskListWithFilter />
			</div>

			{/* Task Detail Dialog - controlled by query parameter */}
			<TaskDetailDialog
				taskId={selectedTaskId}
				open={!!selectedTaskId}
				onOpenChange={handleTaskDialogClose}
			/>
		</PageContent>
	)
}
