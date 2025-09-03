import { cn } from '@/lib/utils'

const statusIconColor = {
	green: 'bg-green-500',
	lime: 'bg-lime-500',
	yellow: 'bg-yellow-500',
	amber: 'bg-amber-500',
	orange: 'bg-orange-500',
	deep_orange: 'bg-orange-600',
	red: 'bg-red-500',
	dark_red: 'bg-red-700',
	maroon: 'bg-rose-700',
	gray: 'bg-gray-500',
	stone: 'bg-stone-500',
} as const

const statusBackgroundColor = {
	green: 'bg-green-100/75 dark:bg-green-950/25',
	lime: 'bg-lime-100/75 dark:bg-lime-950/25',
	yellow: 'bg-yellow-100/75 dark:bg-yellow-950/25',
	amber: 'bg-amber-100/75 dark:bg-amber-950/25',
	orange: 'bg-orange-100/75 dark:bg-orange-950/25',
	deep_orange: 'bg-orange-200/75 dark:bg-orange-950/25',
	red: 'bg-red-100/75 dark:bg-red-950/25',
	dark_red: 'bg-red-200/75 dark:bg-red-950/25',
	maroon: 'bg-rose-100/75 dark:bg-rose-950/25',
	gray: 'bg-gray-100/75 dark:bg-gray-950/25',
	stone: 'bg-stone-100/75 dark:bg-stone-950/25',
} as const

interface StatusBadgeProps {
	name: string
	color: string
	className?: string
}

export function StatusBadge({ name, color, className }: StatusBadgeProps) {
	return (
		<div
			className={cn(
				'inline-flex items-center gap-2 rounded-full px-3 py-0.5 font-medium text-sm',
				statusBackgroundColor[color as keyof typeof statusBackgroundColor],
				className,
			)}
		>
			<span
				className={cn(
					'size-2 shrink-0 rounded-full',
					statusIconColor[color as keyof typeof statusIconColor],
				)}
			/>
			{name}
		</div>
	)
}
