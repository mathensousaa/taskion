import { PageContent } from '@/components/ui/page'
import { TrashList } from '@/modules/trash/components/trash-list'

export default function TrashPage() {
	return (
		<PageContent className="mx-auto max-w-3xl px-4 py-6">
			<TrashList />
		</PageContent>
	)
}
