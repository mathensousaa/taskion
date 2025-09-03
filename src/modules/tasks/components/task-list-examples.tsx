'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useListAllTasks, useListTasks } from '@/modules/tasks/services'
import { TaskStatusFilter } from '../../task-status/components/task-status-filter'

/**
 * Example component demonstrating both API endpoints:
 * - GET /api/tasks (all tasks with filters, no pagination)
 * - GET /api/tasks/paginated (tasks with pagination and filters)
 */
export function TaskListExamples() {
	const [selectedStatus, setSelectedStatus] = useState<string | undefined>()
	const [showPaginated, setShowPaginated] = useState(false)

	// Hook for all tasks (no pagination)
	const {
		data: allTasks,
		status: allTasksStatus,
		error: allTasksError,
	} = useListAllTasks({ status: selectedStatus })

	// Hook for paginated tasks
	const {
		data: paginatedTasks,
		status: paginatedStatus,
		error: paginatedError,
	} = useListTasks(
		10, // limit
		undefined, // cursor
		selectedStatus,
	)

	const handleStatusChange = (status: string | undefined) => {
		setSelectedStatus(status)
	}

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<h1 className="font-bold text-2xl">Task List API Examples</h1>
				<Button
					variant={showPaginated ? 'default' : 'outline'}
					onClick={() => setShowPaginated(!showPaginated)}
				>
					{showPaginated ? 'Show All Tasks' : 'Show Paginated Tasks'}
				</Button>
			</div>

			{/* Status Filter */}
			<div className="flex items-center gap-4">
				<span className="font-medium text-sm">Filter by status:</span>
				<TaskStatusFilter selectedStatus={selectedStatus} onStatusChange={handleStatusChange} />
			</div>

			{/* API Endpoint Info */}
			<Card>
				<CardHeader>
					<CardTitle>Current API Endpoint</CardTitle>
					<CardDescription>
						{showPaginated
							? 'GET /api/tasks/paginated - Returns tasks with pagination and filters'
							: 'GET /api/tasks - Returns all tasks with filters (no pagination)'}
					</CardDescription>
				</CardHeader>
			</Card>

			{/* Results */}
			{showPaginated ? (
				<Card>
					<CardHeader>
						<CardTitle>Paginated Tasks</CardTitle>
						<CardDescription>Using GET /api/tasks/paginated with limit=10</CardDescription>
					</CardHeader>
					<CardContent>
						{paginatedStatus === 'pending' && <div>Loading paginated tasks...</div>}
						{paginatedStatus === 'error' && (
							<div className="text-red-500">Error: {paginatedError?.message}</div>
						)}
						{paginatedStatus === 'success' && paginatedTasks && (
							<div className="space-y-2">
								<div className="text-muted-foreground text-sm">
									Found {paginatedTasks.data.length} tasks
									{paginatedTasks.hasMore && ' (more available)'}
								</div>
								<div className="space-y-1">
									{paginatedTasks.data.map((task) => (
										<div key={task.id} className="rounded border p-2 text-sm">
											<div className="font-medium">{task.title}</div>
											<div className="text-muted-foreground text-xs">
												Status ID: {task.status_id}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>All Tasks</CardTitle>
						<CardDescription>Using GET /api/tasks (no pagination)</CardDescription>
					</CardHeader>
					<CardContent>
						{allTasksStatus === 'pending' && <div>Loading all tasks...</div>}
						{allTasksStatus === 'error' && (
							<div className="text-red-500">Error: {allTasksError?.message}</div>
						)}
						{allTasksStatus === 'success' && allTasks && (
							<div className="space-y-2">
								<div className="text-muted-foreground text-sm">Found {allTasks.length} tasks</div>
								<div className="space-y-1">
									{allTasks.map((task) => (
										<div key={task.id} className="rounded border p-2 text-sm">
											<div className="font-medium">{task.title}</div>
											<div className="text-muted-foreground text-xs">
												Status ID: {task.status_id}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	)
}
