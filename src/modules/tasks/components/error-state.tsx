import { AlertCircle, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
	error: string
	onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="mb-6 rounded-full bg-destructive/10 p-4">
				<AlertCircle className="h-12 w-12 text-destructive" />
			</div>

			<h3 className="mb-2 font-semibold text-xl">Something went wrong</h3>
			<p className="mb-6 max-w-md text-muted-foreground">{error}</p>

			<Button onClick={onRetry} variant="outline" className="gap-2">
				<RefreshCw className="h-4 w-4" />
				Try again
			</Button>
		</div>
	)
}
