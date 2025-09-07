import type { Metadata } from 'next'
import './globals.css'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { ReactQueryProvider } from '@/lib/react-query'

export const metadata: Metadata = {
	title: 'Taskion - Todo List Powered by AI',
	description: 'Taskion is the todo list powered by AI',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ThemeProvider defaultTheme="system" storageKey="ui-theme">
			<ReactQueryProvider>
				<NuqsAdapter>
					<html lang="en">
						<body className={`antialiased`}>
							{children}
							<Toaster />
						</body>
					</html>
				</NuqsAdapter>
			</ReactQueryProvider>
		</ThemeProvider>
	)
}
