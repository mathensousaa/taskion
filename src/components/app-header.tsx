'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageHeader, PageTitle } from '@/components/ui/page'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { TaskSearchDialog } from '@/modules/tasks/components/task-search-dialog'

export default function AppHeader() {
	const [searchDialogOpen, setSearchDialogOpen] = useState(false)

	const isMobile = useIsMobile()

	return (
		<PageHeader>
			<SidebarTrigger />
			<PageTitle className={cn(isMobile && 'sr-only')}>Taskion</PageTitle>
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
