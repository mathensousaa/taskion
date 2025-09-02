import type { Metadata } from 'next'
import './globals.css'
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
		<ThemeProvider defaultTheme="light" storageKey="ui-theme">
			<ReactQueryProvider>
				<html lang="en">
					<body className={`antialiased`}>
						{children}
						<Toaster />
					</body>
				</html>
			</ReactQueryProvider>
		</ThemeProvider>
	)
}
