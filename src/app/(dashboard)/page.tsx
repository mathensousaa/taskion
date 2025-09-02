'use client'

import { useState } from 'react'
import type { Task } from '@/backend/tasks/validation/task.schema'
import { PageContent, PageHeader, PageRoot, PageTitle } from '@/components/ui/page'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { QuickCreateTask } from '@/modules/tasks/components/quick-create-task'
import { TaskList } from '@/modules/tasks/components/task-list'
import { TaskSearch } from '@/modules/tasks/components/task-search'

export default function HomePage() {
	const [searchQuery, setSearchQuery] = useState('')
	const [tasks, setTasks] = useState<Task[]>([])

	return (
		<PageRoot>
			<PageHeader>
				<SidebarTrigger />
				<PageTitle>Home</PageTitle>
			</PageHeader>
			<PageContent className="p-6">
				<div className="space-y-6">
					{/* Search and Quick Create Section */}
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<TaskSearch onSearch={(query) => setSearchQuery(query)} />
						<QuickCreateTask onTaskCreated={(task) => setTasks([...tasks, task])} />
					</div>

					{/* Task List Section */}
					<TaskList
						searchQuery={searchQuery}
						onTaskCreated={() => {
							console.log('Task created')
						}}
					/>
				</div>
			</PageContent>
		</PageRoot>
	)
}
