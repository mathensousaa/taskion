'use client'

import { Search } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageHeader, PageTitle } from '@/components/ui/page'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { TaskSearchDialog } from '@/modules/tasks/components/task-search-dialog'
import { useGetTaskById } from '@/modules/tasks/services'

// Page title mapping
const PAGE_TITLES: Record<string, string> = {
	'/': 'Home',
	'/chat': 'Ask AI',
	'/trash': 'Trash',
}

export default function AppHeader() {
	const [searchDialogOpen, setSearchDialogOpen] = useState(false)
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const isMobile = useIsMobile()

	// Get task ID from query params
	const taskId = searchParams.get('task')
	const { data: task, isLoading: isTaskLoading } = useGetTaskById(taskId || undefined)

	// Determine page title
	const pageTitle = useMemo(() => {
		// If there's a task ID in query params, show task title or loading state
		if (taskId) {
			if (isTaskLoading) {
				return 'Loading...'
			}
			if (task) {
				return task.title
			}
			return 'Task not found'
		}

		// Otherwise, use the mapped title or default
		return PAGE_TITLES[pathname] || 'Taskion'
	}, [taskId, isTaskLoading, task, pathname])

	return (
		<PageHeader>
			<SidebarTrigger />
			<PageTitle className={cn(isMobile && 'sr-only')}>{pageTitle}</PageTitle>
			<Button
				className="absolute inset-0 m-auto w-full max-w-64 justify-start rounded-full bg-muted/50 md:max-w-84"
				variant="outline"
				onClick={() => setSearchDialogOpen(true)}
				size={isMobile ? 'sm' : 'default'}
			>
				<Search className="size-4" />
				Search
				<kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground opacity-100">
					<span className="text-xs">⌘</span>K
				</kbd>
			</Button>
			<TaskSearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} />
		</PageHeader>
	)
}
