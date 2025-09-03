'use client'

import { useState } from 'react'
import { QuickCreateTask } from '@/modules/tasks/components/quick-create-task'
import { TaskSearch } from '@/modules/tasks/components/task-search'
import { TaskStatusFilter } from '../../task-status/components/task-status-filter'
import { TaskList } from './task-list'

export function TaskListWithFilter() {
	const [selectedStatus, setSelectedStatus] = useState<string | undefined>()
	const [searchQuery, setSearchQuery] = useState('')

	return (
		<div className="space-y-4">
			{/* Status Filter */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<TaskSearch onSearch={(query) => setSearchQuery(query)} />
				<TaskStatusFilter selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
				<QuickCreateTask />
			</div>
			<div className="flex items-center justify-between"></div>

			{/* Task List */}
			<TaskList searchQuery={searchQuery} status={selectedStatus} />
		</div>
	)
}
