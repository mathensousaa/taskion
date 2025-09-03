'use client'

import { Search, X } from 'lucide-react'
import { useCallback, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface TaskSearchProps {
	onSearch: (query: string) => void
	placeholder?: string
	className?: string
}

export function TaskSearch({
	onSearch,
	placeholder = 'Search tasks...',
	className,
}: TaskSearchProps) {
	const [query, setQuery] = useState('')
	const [isPending, startTransition] = useTransition()

	const handleSearch = useCallback(
		(searchQuery: string) => {
			startTransition(() => {
				onSearch(searchQuery)
			})
		},
		[onSearch],
	)

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value
			setQuery(value)
			handleSearch(value)
		},
		[handleSearch],
	)

	const handleClear = useCallback(() => {
		setQuery('')
		handleSearch('')
	}, [handleSearch])

	return (
		<div className={cn('relative max-w-md flex-1', className)}>
			<div className="relative">
				<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
				<Input
					value={query}
					onChange={handleInputChange}
					placeholder={placeholder}
					className="h-8 border-border pr-10 pl-10 transition-colors"
					disabled={isPending}
				/>
				{query && (
					<Button
						variant="ghost"
						size="sm"
						onClick={handleClear}
						className="-translate-y-1/2 absolute top-1/2 right-1 h-8 w-8 p-0 hover:bg-accent"
						disabled={isPending}
					>
						<X className="h-4 w-4" />
						<span className="sr-only">Clear search</span>
					</Button>
				)}
			</div>
		</div>
	)
}
