import * as SwitchPrimitives from '@radix-ui/react-switch'
import { Moon, Sun } from 'lucide-react'
import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { TooltipWrapper } from '@/components/tooltip-wrapper'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
	const buttonRef = useRef<HTMLButtonElement | null>(null)
	const changeTheme = async (checked: boolean) => {
		if (!buttonRef.current) return

		await document.startViewTransition(() => {
			flushSync(() => {
				const dark = document.documentElement.classList.toggle('dark', checked)
				setIsDarkMode(dark)
			})
		}).ready

		const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
		const y = top + height / 2
		const x = left + width / 2

		const right = window.innerWidth - left
		const bottom = window.innerHeight - top
		const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom))

		document.documentElement.animate(
			{
				clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRad}px at ${x}px ${y}px)`],
			},
			{
				duration: 700,
				easing: 'ease-in-out',
				pseudoElement: '::view-transition-new(root)',
			},
		)
	}

	return (
		<div className="px-2">
			<TooltipWrapper label="Toggle light/dark mode" asChild>
				<SwitchPrimitives.Root
					ref={buttonRef}
					checked={isDarkMode}
					onCheckedChange={changeTheme}
					className={cn(
						'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
						isDarkMode ? 'bg-primary' : 'bg-input',
					)}
				>
					<SwitchPrimitives.Thumb
						className={cn(
							'pointer-events-none flex size-5 items-center justify-center rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
						)}
					>
						{isDarkMode ? <Moon className="size-3" /> : <Sun className="size-3" />}
					</SwitchPrimitives.Thumb>
				</SwitchPrimitives.Root>
			</TooltipWrapper>
		</div>
	)
}
