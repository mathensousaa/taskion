import { PageContent } from '@/components/ui/page'
import { TrashList } from '@/modules/trash/components/trash-list'

export default function TrashPage() {
	return (
		<PageContent className="p-6">
			<div className="space-y-6">
				<TrashList />
			</div>
		</PageContent>
	)
}
