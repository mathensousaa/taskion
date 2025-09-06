import { PageContent, PageHeader, PageRoot, PageTitle } from '@/components/ui/page'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { TrashList } from '@/modules/trash/components/trash-list'

export default function TrashPage() {
	return (
		<PageRoot>
			<PageHeader>
				<SidebarTrigger />
				<PageTitle>Trash</PageTitle>
			</PageHeader>
			<PageContent className="p-6">
				<div className="space-y-6">
					<TrashList />
				</div>
			</PageContent>
		</PageRoot>
	)
}
