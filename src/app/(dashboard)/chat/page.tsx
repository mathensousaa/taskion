'use client'

import { Standard } from '@typebot.io/react'
import { PageContent, PageHeader, PageRoot, PageTitle } from '@/components/ui/page'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetMe } from '@/modules'

export default function Chat() {
	return (
		<PageRoot>
			<PageHeader>
				<SidebarTrigger />
				<PageTitle>Taskion AI Assistant</PageTitle>
			</PageHeader>
			<PageContent className="min-h-svh">
				<ChatComponent />
			</PageContent>
		</PageRoot>
	)
}

function ChatSkeleton() {
	return (
		<div className="flex h-full w-full flex-col space-y-4 p-4">
			{/* Chat header skeleton */}
			<div className="flex items-center space-x-3 border-b pb-4">
				<Skeleton className="h-10 w-10 rounded-full" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-3 w-20" />
				</div>
			</div>

			{/* Chat messages skeleton */}
			<div className="flex-1 space-y-4">
				{/* Bot message */}
				<div className="flex space-x-3">
					<Skeleton className="h-8 w-8 flex-shrink-0 rounded-full" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
					</div>
				</div>

				{/* User message */}
				<div className="flex justify-end space-x-3">
					<div className="max-w-xs flex-1 space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="ml-auto h-4 w-2/3" />
					</div>
					<Skeleton className="h-8 w-8 flex-shrink-0 rounded-full" />
				</div>

				{/* Bot message */}
				<div className="flex space-x-3">
					<Skeleton className="h-8 w-8 flex-shrink-0 rounded-full" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-4/5" />
						<Skeleton className="h-4 w-3/5" />
						<Skeleton className="h-4 w-2/3" />
					</div>
				</div>
			</div>

			{/* Input area skeleton */}
			<div className="flex space-x-2 border-t pt-4">
				<Skeleton className="h-10 flex-1" />
				<Skeleton className="h-10 w-20" />
			</div>
		</div>
	)
}

export function ChatComponent() {
	const { data: user, status: userStatus } = useGetMe()

	if (userStatus === 'pending') {
		return <ChatSkeleton />
	}

	if (userStatus === 'error') {
		return <div>Error</div>
	}

	return (
		<Standard
			apiHost="https://chat.taskion.matheusousa.dev"
			typebot="taskion-ai-assistant"
			prefilledVariables={{ userEmail: user.email }}
			style={{ width: '100%', height: '100%' }}
		/>
	)
}
