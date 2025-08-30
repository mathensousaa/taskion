'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { decodeCursor, encodeCursor } from '@/lib/utils'

interface Task {
	id: string
	title: string
	description: string | null
	status_id: string
	user_id: string
	order: number
	created_at: string
	deleted_at: string | null
	updated_at: string | null
}

interface Cursor {
	order: number
	created_at: string
	id: string
}

interface PaginatedResponse {
	success: boolean
	message: string
	tasks: Task[]
	nextCursor?: Cursor
	hasMore: boolean
}

export default function TaskList() {
	const [tasks, setTasks] = useState<Task[]>([])
	const [loading, setLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [nextCursor, setNextCursor] = useState<Cursor | null>(null)
	const [error, setError] = useState<string | null>(null)
	
	const observer = useRef<IntersectionObserver>()
	const lastTaskElementRef = useRef<HTMLDivElement>(null)

	const loadTasks = useCallback(async (cursor?: Cursor) => {
		try {
			setLoading(true)
			setError(null)
			
			const params = new URLSearchParams()
			params.append('limit', '20')
			
			if (cursor) {
				params.append('cursor', encodeCursor(cursor))
			}
			
			const response = await fetch(`/api/tasks?${params.toString()}`)
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			
			const data: PaginatedResponse = await response.json()
			
			if (data.success) {
				if (cursor) {
					// Append new tasks for pagination
					setTasks(prev => [...prev, ...data.tasks])
				} else {
					// Replace tasks for initial load
					setTasks(data.tasks)
				}
				
				setNextCursor(data.nextCursor || null)
				setHasMore(data.hasMore)
			} else {
				throw new Error(data.message || 'Failed to load tasks')
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred')
		} finally {
			setLoading(false)
		}
	}, [])

	// Load initial tasks
	useEffect(() => {
		loadTasks()
	}, [loadTasks])

	// Intersection Observer for infinite scroll
	useEffect(() => {
		if (loading) return
		
		if (observer.current) observer.current.disconnect()
		
		observer.current = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && hasMore && nextCursor) {
				loadTasks(nextCursor)
			}
		})
		
		if (lastTaskElementRef.current) {
			observer.current.observe(lastTaskElementRef.current)
		}
		
		return () => observer.current?.disconnect()
	}, [loading, hasMore, nextCursor, loadTasks])

	// Reorder tasks (for drag & drop)
	const reorderTasks = async (reorderData: Array<{ taskId: string; newOrder: number }>) => {
		try {
			setLoading(true)
			setError(null)
			
			const response = await fetch('/api/tasks', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(reorderData),
			})
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			
			const data = await response.json()
			
			if (data.success) {
				// Reload tasks to get the new order
				await loadTasks()
			} else {
				throw new Error(data.message || 'Failed to reorder tasks')
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to reorder tasks')
		} finally {
			setLoading(false)
		}
	}

	// Create new task
	const createTask = async (title: string, description?: string) => {
		try {
			setLoading(true)
			setError(null)
			
			const response = await fetch('/api/tasks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title, description }),
			})
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			
			const data = await response.json()
			
			if (data.success) {
				// Reload tasks to include the new task
				await loadTasks()
			} else {
				throw new Error(data.message || 'Failed to create task')
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create task')
		} finally {
			setLoading(false)
		}
	}

	if (error) {
		return (
			<div className="rounded-md border border-red-200 bg-red-50 p-4">
				<p className="text-red-800">Error: {error}</p>
				<button
					onClick={() => loadTasks()}
					className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
				>
					Retry
				</button>
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-4xl p-6">
			<h1 className="mb-6 font-bold text-3xl">Tasks</h1>
			
			{/* Task Creation Form */}
			<div className="mb-6 rounded-lg bg-gray-50 p-4">
				<h2 className="mb-3 font-semibold text-lg">Create New Task</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						const formData = new FormData(e.currentTarget)
						const title = formData.get('title') as string
						const description = formData.get('description') as string
						
						if (title.trim()) {
							createTask(title.trim(), description.trim() || undefined)
							e.currentTarget.reset()
						}
					}}
					className="flex gap-3"
				>
					<input
						type="text"
						name="title"
						placeholder="Task title"
						required
						className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<input
						type="text"
						name="description"
						placeholder="Description (optional)"
						className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="submit"
						disabled={loading}
						className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
					>
						{loading ? 'Creating...' : 'Create Task'}
					</button>
				</form>
			</div>
			
			{/* Tasks List */}
			<div className="space-y-3">
				{tasks.map((task, index) => (
					<div
						key={task.id}
						ref={index === tasks.length - 1 ? lastTaskElementRef : null}
						className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
					>
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<h3 className="font-semibold text-lg">{task.title}</h3>
								{task.description && (
									<p className="mt-1 text-gray-600">{task.description}</p>
								)}
								<div className="mt-2 flex items-center gap-4 text-gray-500 text-sm">
									<span>Order: {task.order}</span>
									<span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
								</div>
							</div>
						</div>
					</div>
				))}
				
				{loading && (
					<div className="py-4 text-center">
						<div className="inline-block h-6 w-6 animate-spin rounded-full border-blue-600 border-b-2"></div>
						<span className="ml-2 text-gray-600">Loading...</span>
					</div>
				)}
				
				{!hasMore && tasks.length > 0 && (
					<div className="py-4 text-center text-gray-500">
						No more tasks to load
					</div>
				)}
				
				{tasks.length === 0 && !loading && (
					<div className="py-8 text-center text-gray-500">
						No tasks found. Create your first task above!
					</div>
				)}
			</div>
		</div>
	)
}
