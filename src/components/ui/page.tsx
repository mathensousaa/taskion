import { forwardRef, type HTMLAttributes } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface PageRootProps extends HTMLAttributes<HTMLElement> {}

const PageBody = forwardRef<HTMLDivElement, PageRootProps>(({ className, ...props }, ref) => (
	<section
		ref={ref}
		className={cn('flex h-full w-full flex-col gap-6 p-3 md:p-6', className)}
		{...props}
	/>
))

PageBody.displayName = 'PageBody'

const PageHeader = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
	({ className, ...props }, ref) => (
		<header
			ref={ref}
			className={cn('flex w-full flex-row items-center justify-start gap-2 px-3 py-2', className)}
			{...props}
		/>
	),
)

PageHeader.displayName = 'PageHeader'

interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const PageTitle = forwardRef<HTMLHeadingElement, PageTitleProps>(({ className, ...props }, ref) => (
	<span ref={ref} className={cn('font-medium', className)} {...props} />
))

PageTitle.displayName = 'PageTitle'

interface PageTitleSkeletonProps extends HTMLAttributes<HTMLDivElement> {}

const PageTitleSkeleton = ({ className, ...props }: PageTitleSkeletonProps) => (
	<Skeleton className={cn('h-8', className)} {...props} />
)

const PageContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn('inset-x-0 mx-auto flex w-full max-w-3xl flex-col gap-4 p-2 md:p-6', className)}
			{...props}
		/>
	),
)

PageContent.displayName = 'PageContent'

const PageRoot = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('flex flex-col gap-4', className)} {...props} />
	),
)

PageRoot.displayName = 'PageRoot'

export { PageBody, PageRoot, PageContent, PageHeader, PageTitle, PageTitleSkeleton }
