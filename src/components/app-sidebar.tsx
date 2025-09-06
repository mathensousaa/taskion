'use client'

import {
	ChevronDown,
	Home,
	ListTodo,
	LogOut,
	Plus,
	Search,
	Sparkles,
	Trash2,
	User,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import * as React from 'react'
// import { NavFavorites } from "@/components/nav-favorites"
// import { NavSecondary } from "@/components/nav-secondary"
// import { NavWorkspaces } from "@/components/nav-workspaces"
// import { TeamSwitcher } from "@/components/team-switcher"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenuBadge,
	SidebarRail,
	sidebarMenuButtonVariants,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'
import { useCreateTask } from '@/modules/tasks/services'

const data = {
	navMain: [
		{
			title: 'Search',
			url: '#',
			icon: Search,
		},
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
	const [searchDialogOpen, setSearchDialogOpen] = React.useState(false)
	const [addTaskDialogOpen, setAddTaskDialogOpen] = React.useState(false)

	return (
		<Sidebar className="border-r-0" {...props}>
			<SidebarHeader>
				<NavLogo />
				<NavMain
					items={data.navMain}
					onSearchClickAction={() => setSearchDialogOpen(true)}
					onAddTaskClickAction={() => setAddTaskDialogOpen(true)}
				/>
			</SidebarHeader>
			<SidebarContent>
				{/* <NavFavorites favorites={data.favorites} /> */}
				{/* <NavWorkspaces workspaces={data.workspaces} /> */}
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarRail />
			<TaskSearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} />
			<AddTaskDialog open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen} />
		</Sidebar>
	)
}

import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
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
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { NewTaskCard } from '@/modules/tasks/components/new-task-card'
import { TaskSearchDialog } from '@/modules/tasks/components/task-search-dialog'
import { showTaskCreateError, showTaskCreateSuccess } from '@/modules/tasks/utils'

export function NavLogo() {
	const { logout, user } = useAuth()

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="w-full px-1.5">
							<div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
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
	onSearchClickAction,
	onAddTaskClickAction,
}: {
	items: {
		title: string
		url: string
		icon: LucideIcon
		isActive?: boolean
	}[]
	onSearchClickAction?: () => void
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

				// Handle Search button click
				if (item.title === 'Search' && item.url === '#') {
					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild isActive={isActive} onClick={onSearchClickAction}>
								<button type="button" className="w-full">
									<item.icon />
									<span>{item.title}</span>
									<kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground opacity-100">
										<span className="text-xs">⌘</span>K
									</kbd>
								</button>
							</SidebarMenuButton>
						</SidebarMenuItem>
					)
				}

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
			<DialogContent className="p-0">
				<DialogTitle className="sr-only">Add New Task</DialogTitle>
				<NewTaskCard onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isPending} />
			</DialogContent>
		</Dialog>
	)
}
