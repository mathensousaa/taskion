'use client'

import { useTaskFilters } from '@/modules/tasks/hooks/use-task-filters'
// import { TaskSearch } from '@/modules/tasks/components/task-search'
import { TaskStatusInlineFilter } from '../../task-status/components/task-status-inline-filter'
import { TaskList } from './task-list'

export function TaskListWithFilter() {
	const { status, setStatus } = useTaskFilters()

	return (
		<div className="space-y-4">
			{/* Status Filter */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				{/* <TaskSearch onSearch={() => {}} /> */}
				<TaskStatusInlineFilter selectedStatus={status} onStatusChange={setStatus} />
			</div>
			<div className="flex items-center justify-between"></div>

			{/* Task List */}
			<TaskList status={status} />
		</div>
	)
}
