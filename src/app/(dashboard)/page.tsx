'use client'

import { PageContent, PageHeader, PageRoot, PageTitle } from '@/components/ui/page'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { TaskListWithFilter } from '@/modules/tasks/components/task-list-with-filter'

export default function HomePage() {
	return (
		<PageRoot>
			<PageHeader>
				<SidebarTrigger />
				<PageTitle>Home</PageTitle>
			</PageHeader>
			<PageContent className="p-6">
				<div className="space-y-6">
					<TaskListWithFilter />
				</div>
			</PageContent>
		</PageRoot>
	)
}
