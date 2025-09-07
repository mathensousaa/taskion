'use client'

import { StatusBadge } from '@/components/status-badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useListTaskStatuses } from '@/modules/task-status/services'

interface TaskStatusInlineFilterProps {
	selectedStatus?: string
	onStatusChange: (status: string | undefined) => void
}

export function TaskStatusInlineFilter({
	selectedStatus,
	onStatusChange,
}: TaskStatusInlineFilterProps) {
	const { data: taskStatuses, status } = useListTaskStatuses()

	const handleStatusClick = (statusSlug: string | undefined) => {
		onStatusChange(statusSlug)
	}

	if (status === 'pending') {
		return (
			<div className="flex gap-2">
				<div className="h-8 w-20 animate-pulse rounded-full bg-muted" />
				<div className="h-8 w-20 animate-pulse rounded-full bg-muted" />
				<div className="h-8 w-20 animate-pulse rounded-full bg-muted" />
				<div className="h-8 w-20 animate-pulse rounded-full bg-muted" />
			</div>
		)
	}

	if (status === 'error' || !taskStatuses) {
		return null
	}

	return (
		<ScrollArea className="w-96 min-w-0 max-w-full whitespace-nowrap">
			<div className="flex max-w-fit gap-1">
				<button type="button" onClick={() => handleStatusClick(undefined)} className="shrink-0">
					<StatusBadge
						name="All"
						color="gray"
						className={cn(
							'cursor-pointer opacity-50 transition-all duration-200',
							!selectedStatus && 'border-1 border-primary/25 opacity-100',
						)}
					/>
				</button>

				{taskStatuses.map((status) => (
					<button
						type="button"
						key={status.id}
						onClick={() => handleStatusClick(status.slug)}
						className="shrink-0"
					>
						<StatusBadge
							name={status.name}
							color={status.color}
							className={cn(
								'cursor-pointer opacity-50 transition-all duration-200',
								selectedStatus === status.slug && 'border-1 border-primary/25 opacity-100',
							)}
						/>
					</button>
				))}
			</div>
			<ScrollBar orientation="horizontal" className="hidden" />
		</ScrollArea>
	)
}
