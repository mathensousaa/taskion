'use client'

import { Standard } from '@typebot.io/react'
import { PageContent, PageHeader, PageRoot, PageTitle } from '@/components/ui/page'
import { SidebarTrigger } from '@/components/ui/sidebar'
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

export function ChatComponent() {
	const { data: user, status: userStatus } = useGetMe()

	if (userStatus === 'pending') {
		return <div>Loading...</div>
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
