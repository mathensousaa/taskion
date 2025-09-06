'use client'

import { Bubble } from '@typebot.io/react'
import AppHeader from '@/components/app-header'
import { AppSidebar } from '@/components/app-sidebar'
import { ProtectedRoute } from '@/components/protected-route'
import { PageRoot } from '@/components/ui/page'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useGetMe } from '@/modules'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const { data: user } = useGetMe()

	return (
		<ProtectedRoute>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<PageRoot>
						<AppHeader />
						{children}
					</PageRoot>

					<Bubble
						apiHost="https://chat.taskion.matheusousa.dev"
						typebot="taskion-ai-assistant"
						prefilledVariables={{ userEmail: user?.email }}
						theme={{
							placement: 'right',
							button: { backgroundColor: 'var(--primary)' },
							chatWindow: { backgroundColor: 'var(--muted)' },
						}}
					/>
				</SidebarInset>
			</SidebarProvider>
		</ProtectedRoute>
	)
}
