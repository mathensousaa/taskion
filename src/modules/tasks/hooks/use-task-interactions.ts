import { useCallback, useEffect, useRef } from 'react'

interface UseTaskInteractionsProps {
	taskId: string
	onTaskClick?: (taskId: string) => void
	handleStatusUpdate: (statusSlug: string) => void
	taskStatusSlug?: string
	isEditing: boolean
}

export function useTaskInteractions({
	taskId,
	onTaskClick,
	handleStatusUpdate,
	taskStatusSlug,
	isEditing,
}: UseTaskInteractionsProps) {
	const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (clickTimeoutRef.current) {
				clearTimeout(clickTimeoutRef.current)
			}
		}
	}, [])

	const handleDoubleClick = useCallback(
		(e: React.MouseEvent) => {
			// Don't handle double-click if user is editing
			if (isEditing) return

			// Check if the click target is an interactive element
			const target = e.target as HTMLElement
			if (
				target.closest('button') ||
				target.closest('input') ||
				target.closest('textarea') ||
				target.closest('[role="menuitem"]') ||
				target.closest('[data-radix-collection-item]') ||
				target.closest('[data-state="open"]') ||
				target.closest('[data-slot="context-menu"]')
			)
				return

			// Clear the single-click timeout
			if (clickTimeoutRef.current) {
				clearTimeout(clickTimeoutRef.current)
				clickTimeoutRef.current = null
			}

			// Toggle between not_started and in_progress
			const currentSlug = taskStatusSlug
			const newSlug = currentSlug === 'in_progress' ? 'not_started' : 'in_progress'

			handleStatusUpdate(newSlug)
		},
		[isEditing, taskStatusSlug, handleStatusUpdate],
	)

	const handleCardClick = useCallback(
		(e: React.MouseEvent) => {
			// Don't open dialog if user is editing or clicking on interactive elements
			if (isEditing) return

			// Only handle left clicks (button === 0)
			if (e.button !== 0) return

			// Check if the click target is an interactive element
			const target = e.target as HTMLElement
			if (
				target.closest('button') ||
				target.closest('input') ||
				target.closest('textarea') ||
				target.closest('[role="menuitem"]') ||
				target.closest('[data-radix-collection-item]') ||
				target.closest('[data-state="open"]') ||
				target.closest('[data-slot="context-menu"]')
			)
				return

			// Clear any existing timeout
			if (clickTimeoutRef.current) {
				clearTimeout(clickTimeoutRef.current)
				clickTimeoutRef.current = null
				return // This was a double-click, don't open dialog
			}

			// Set a timeout to open dialog after a delay
			clickTimeoutRef.current = setTimeout(() => {
				onTaskClick?.(taskId)
				clickTimeoutRef.current = null
			}, 200) // 200ms delay to detect double-click
		},
		[isEditing, onTaskClick, taskId],
	)

	return {
		handleDoubleClick,
		handleCardClick,
	}
}
