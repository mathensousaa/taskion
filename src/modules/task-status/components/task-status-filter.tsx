'use client'

import { StatusBadge } from '@/components/status-badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useListTaskStatuses } from '@/modules/task-status/services'

interface TaskStatusFilterProps {
	selectedStatus?: string
	onStatusChange: (status: string | undefined) => void
}

export function TaskStatusFilter({ selectedStatus, onStatusChange }: TaskStatusFilterProps) {
	const { data: taskStatuses, status } = useListTaskStatuses()

	const handleStatusChange = (value: string) => {
		onStatusChange(value === 'all' ? undefined : value)
	}

	if (status === 'pending') {
		return <div className="h-10 w-32 animate-pulse rounded bg-muted" />
	}

	if (status === 'error' || !taskStatuses) {
		return null
	}

	return (
		<div className="flex items-center gap-2">
			<Select value={selectedStatus || 'all'} onValueChange={handleStatusChange}>
				<SelectTrigger className="h-8 w-40 border-border py-0">
					<SelectValue placeholder="All statuses" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">
						<StatusBadge name="All statuses" color="gray" />
					</SelectItem>
					{taskStatuses.map((status) => (
						<SelectItem key={status.id} value={status.slug}>
							<StatusBadge name={status.name} color={status.color} />
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
