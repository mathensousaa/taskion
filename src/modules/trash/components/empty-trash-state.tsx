import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyTrashStateProps {
	className?: string
}

export function EmptyTrashState({ className }: EmptyTrashStateProps) {
	return (
		<div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
			<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
				<Trash2 className="h-10 w-10 text-muted-foreground" />
			</div>
			<h3 className="mt-4 font-semibold text-lg">No tasks in trash</h3>
			<p className="mt-2 text-muted-foreground">
				Tasks you delete will appear here. They can be permanently deleted or restored.
			</p>
			<div className="mt-6">
				<Button asChild>
					<Link href="/">
						<Trash2 className="mr-2 h-4 w-4" />
						Go to Tasks
					</Link>
				</Button>
			</div>
		</div>
	)
}
