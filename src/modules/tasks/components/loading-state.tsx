import { Skeleton } from '@/components/ui/skeleton'

export function LoadingState() {
	return (
		<div className="space-y-3">
			{Array.from({ length: 5 }).map((_, index) => (
				<div
					key={`loading-skeleton-${index as React.Key}`}
					className="rounded-lg border bg-card p-4"
				>
					<div className="space-y-3">
						{/* Title skeleton */}
						<Skeleton className="h-6 w-3/4" />

						{/* Description skeleton */}
						<Skeleton className="h-4 w-1/2" />

						{/* Optional second description line */}
						{index % 2 === 0 && <Skeleton className="h-4 w-2/3" />}
					</div>
				</div>
			))}
		</div>
	)
}
