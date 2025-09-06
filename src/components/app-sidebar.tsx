'use client'

import type { LucideIcon } from 'lucide-react'
import { ChevronDown, Home, ListTodo, LogOut, Plus, Sparkles, Trash2, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { NavRecents } from '@/components/nav-recents'
import { ThemeToggle } from '@/components/theme-toggle'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	sidebarMenuButtonVariants,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { NewTaskCard } from '@/modules/tasks/components/new-task-card'
import { useCreateTask } from '@/modules/tasks/services'
import { showTaskCreateError, showTaskCreateSuccess } from '@/modules/tasks/utils'

const data = {
	navMain: [
		{
			title: 'Ask AI',
			url: '/chat',
			icon: Sparkles,
		},
		{
			title: 'Home',
			url: '/',
			icon: Home,
		},
		{
			title: 'Trash',
			url: '/trash',
			icon: Trash2,
		},
	],
	navSecondary: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const [addTaskDialogOpen, setAddTaskDialogOpen] = React.useState(false)

	return (
		<Sidebar className="border-r-0" {...props}>
			<SidebarHeader>
				<NavLogo />
				<NavMain items={data.navMain} onAddTaskClickAction={() => setAddTaskDialogOpen(true)} />
			</SidebarHeader>
			<SidebarContent>
				<NavRecents />
				{/* <NavFavorites favorites={data.favorites} /> */}
				{/* <NavWorkspaces workspaces={data.workspaces} /> */}
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarRail />
			<AddTaskDialog open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen} />
		</Sidebar>
	)
}

export function NavLogo() {
	const { logout, user } = useAuth()

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="w-full px-1.5">
							<div className="flex aspect-square size-5 items-center justify-center rounded-md bg-primary text-sidebar-primary-foreground">
								<ListTodo className="size-3" />
							</div>
							<span className="truncate font-medium">Taskion</span>
							<ChevronDown className="opacity-50" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-64 rounded-lg"
						align="start"
						side="bottom"
						sideOffset={4}
					>
						<DropdownMenuLabel className="flex items-center gap-2 text-base text-muted-foreground">
							<div className="flex aspect-square size-10 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
								<ListTodo className="size-6" />
							</div>
							Taskion
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{user && (
							<DropdownMenuItem className="gap-2">
								<div className="flex size-6 items-center justify-center rounded-md border bg-background">
									<User className="size-3" />
								</div>
								<div className="font-medium text-muted-foreground">{user.name}</div>
							</DropdownMenuItem>
						)}
						<DropdownMenuSeparator />
						<DropdownMenuItem className="gap-2" onClick={logout}>
							<div className="flex size-6 items-center justify-center rounded-md border bg-background">
								<LogOut className="size-3" />
							</div>
							<div className="font-medium text-muted-foreground">Sign Out</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

export function NavMain({
	items,
	onAddTaskClickAction,
}: {
	items: {
		title: string
		url: string
		icon: LucideIcon
		isActive?: boolean
	}[]
	onAddTaskClickAction?: () => void
}) {
	const pathname = usePathname()

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton asChild className="text-primary">
					<button
						type="button"
						className={cn(sidebarMenuButtonVariants())}
						onClick={onAddTaskClickAction}
					>
						<div className="rounded-full bg-primary p-0.5 text-primary-foreground">
							<Plus className="size-4" />
						</div>
						Add task
					</button>
				</SidebarMenuButton>
			</SidebarMenuItem>
			{items.map((item) => {
				// Skip active state for items with placeholder URLs like '#'
				const isActive = item.url !== '#' && pathname === item.url

				return (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton asChild isActive={isActive}>
							<Link href={item.url}>
								<item.icon />
								<span>{item.title}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				)
			})}
		</SidebarMenu>
	)
}

export function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string
		url: string
		icon: LucideIcon
		badge?: React.ReactNode
	}[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild>
								<Link href={item.url}>
									<item.icon />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
							{item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
						</SidebarMenuItem>
					))}
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<ThemeToggle />
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}

function AddTaskDialog({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const { mutate: createTask, isPending } = useCreateTask()

	const handleSubmit = async (data: { title: string }) => {
		createTask(data, {
			onSuccess: (newTask) => {
				onOpenChange(false)
				showTaskCreateSuccess(newTask.title)
			},
			onError: (error) => {
				showTaskCreateError(error)
			},
		})
	}

	const handleCancel = () => {
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-none bg-transparent p-0 shadow-none">
				<DialogTitle className="sr-only">Add New Task</DialogTitle>
				<NewTaskCard onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isPending} />
			</DialogContent>
		</Dialog>
	)
}
