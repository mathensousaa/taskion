import * as SwitchPrimitives from '@radix-ui/react-switch'
import { Moon, Sun } from 'lucide-react'
import { useCallback } from 'react'
import { useTheme } from '@/components/theme-provider'
import { TooltipWrapper } from '@/components/tooltip-wrapper'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
	const { theme, setTheme } = useTheme()

	const handleThemeToggle = useCallback(
		(checked: boolean) => {
			setTheme(checked ? 'dark' : 'light')
		},
		[setTheme],
	)

	return (
		<div className="px-2">
			<TooltipWrapper label="Toggle light/dark mode" asChild>
				<SwitchPrimitives.Root
					checked={theme === 'dark'}
					onCheckedChange={handleThemeToggle}
					className={cn(
						'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
						theme === 'dark' ? 'bg-primary' : 'bg-input',
					)}
				>
					<SwitchPrimitives.Thumb
						className={cn(
							'pointer-events-none flex size-5 items-center justify-center rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
						)}
					>
						{theme === 'dark' ? <Moon className="size-3" /> : <Sun className="size-3" />}
					</SwitchPrimitives.Thumb>
				</SwitchPrimitives.Root>
			</TooltipWrapper>
		</div>
	)
}
