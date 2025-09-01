'use client'

import { Loader2, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { Task } from '@/backend/tasks/validation/task.schema'
import { Button } from '@/components/ui/button'
import { parseResponseData } from '@/lib/utils'
import { trashService } from '@/modules/trash/services/trash.service'
import { DeleteTaskDialog } from './delete-task-dialog'
import { EmptyTrashDialog } from './empty-trash-dialog'
import { EmptyTrashState } from './empty-trash-state'
import { TrashTaskCard } from './trash-task-card'

export function TrashList() {
	const [tasks, setTasks] = useState<Task[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [deleteTaskDialog, setDeleteTaskDialog] = useState<{
		open: boolean
		task: Task | null
	}>({ open: false, task: null })
	const [emptyTrashDialog, setEmptyTrashDialog] = useState(false)
	const [isDeletingTask, setIsDeletingTask] = useState(false)
	const [isEmptyingTrash, setIsEmptyingTrash] = useState(false)

	const loadTrash = useCallback(async () => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await trashService.getTrash()
			if (response) {
				setTasks(parseResponseData(response))
			}
		} catch (error: any) {
			console.error('Failed to load trash:', error)
			setError('Failed to load trash. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}, [])

	// Load initial trash
	useEffect(() => {
		loadTrash()
	}, [loadTrash])

	const handlePermanentlyDeleteTask = useCallback((taskId: string) => {
		setTasks((prev) => prev.filter((task) => task.id !== taskId))
		setDeleteTaskDialog({ open: false, task: null })
	}, [])

	const handleEmptyTrash = useCallback(async () => {
		setIsEmptyingTrash(true)
		try {
			await trashService.emptyTrash()
			setTasks([])
			setEmptyTrashDialog(false)
		} catch (error) {
			console.error('Failed to empty trash:', error)
		} finally {
			setIsEmptyingTrash(false)
		}
	}, [])

	const openDeleteTaskDialog = useCallback((task: Task) => {
		setDeleteTaskDialog({ open: true, task })
	}, [])

	const closeDeleteTaskDialog = useCallback(() => {
		setDeleteTaskDialog({ open: false, task: null })
	}, [])

	const openEmptyTrashDialog = useCallback(() => {
		setEmptyTrashDialog(true)
	}, [])

	const closeEmptyTrashDialog = useCallback(() => {
		setEmptyTrashDialog(false)
	}, [])

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="flex items-center gap-2 text-muted-foreground">
					<Loader2 className="h-5 w-5 animate-spin" />
					Loading trash...
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
					<Trash2 className="h-10 w-10 text-muted-foreground" />
				</div>
				<h3 className="mt-4 font-semibold text-lg">Failed to load trash</h3>
				<p className="mt-2 text-muted-foreground">{error}</p>
				<Button onClick={loadTrash} className="mt-4">
					Try Again
				</Button>
			</div>
		)
	}

	if (tasks.length === 0) {
		return <EmptyTrashState />
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">Trash</h1>
					<p className="text-muted-foreground">
						{tasks.length} task{tasks.length === 1 ? '' : 's'} in trash
					</p>
				</div>
				<Button variant="destructive" onClick={openEmptyTrashDialog} disabled={isEmptyingTrash}>
					{isEmptyingTrash ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Emptying...
						</>
					) : (
						<>
							<Trash2 className="mr-2 h-4 w-4" />
							Empty Trash
						</>
					)}
				</Button>
			</div>

			{/* Task List */}
			<div className="space-y-3">
				{tasks.map((task) => (
					<TrashTaskCard
						key={task.id}
						task={task}
						onPermanentlyDelete={(taskId: string) => {
							// Extract the task from the ID and open the delete dialog
							const taskToDelete = tasks.find((t) => t.id === taskId)
							if (taskToDelete) {
								openDeleteTaskDialog(taskToDelete)
							}
						}}
					/>
				))}
			</div>

			{/* Delete Task Dialog */}
			{deleteTaskDialog.task && (
				<DeleteTaskDialog
					open={deleteTaskDialog.open}
					onOpenChange={closeDeleteTaskDialog}
					taskTitle={deleteTaskDialog.task.title}
					onConfirm={() => {
						if (deleteTaskDialog.task) {
							handlePermanentlyDeleteTask(deleteTaskDialog.task.id)
						}
					}}
					isDeleting={isDeletingTask}
				/>
			)}

			{/* Empty Trash Dialog */}
			<EmptyTrashDialog
				open={emptyTrashDialog}
				onOpenChange={closeEmptyTrashDialog}
				taskCount={tasks.length}
				onConfirm={handleEmptyTrash}
				isEmptying={isEmptyingTrash}
			/>
		</div>
	)
}
