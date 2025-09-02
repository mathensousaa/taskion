'use client'

import { Standard } from '@typebot.io/react'
import { PageContent, PageHeader, PageRoot, PageTitle } from '@/components/ui/page'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function Chat() {
	return (
		<PageRoot>
			<PageHeader>
				<SidebarTrigger />
				<PageTitle>Taskion AI Assistant</PageTitle>
			</PageHeader>
			<PageContent className="min-h-svh">
				<Standard
					typebot="taskion-ai-assistant"
					apiHost="https://chat.taskion.matheusousa.dev"
					style={{ width: '100%', height: '100%' }}
				/>
			</PageContent>
		</PageRoot>
	)
}
