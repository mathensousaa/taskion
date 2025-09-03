'use client'

import { ListTodo } from 'lucide-react'
import Link from 'next/link'
import { Suspense, useRef } from 'react'
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'
import { cn } from '@/lib/utils'
import { LoginForm } from '@/modules/auth/components'

export default function LoginPage() {
	return (
		<div className="grid min-h-svh overflow-hidden lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<Link href="/" className="flex items-center gap-2 font-medium">
						<div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<ListTodo className="size-4" />
						</div>
						Taskion
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<Suspense fallback={<div>Loading...</div>}>
							<LoginForm />
						</Suspense>
					</div>
				</div>
			</div>
			<Pattern />
		</div>
	)
}

const Pattern = () => {
	const patternRef = useRef<HTMLDivElement>(null)

	return (
		<div ref={patternRef} className="relative hidden bg-muted lg:block">
			<AnimatedGridPattern
				className={cn('inset-x-0 inset-y-[-30%] h-[200%] skew-y-12')}
				style={{
					height: patternRef.current?.clientHeight,
					width: patternRef.current?.clientWidth,
				}}
			/>
		</div>
	)
}
