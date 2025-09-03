'use client'

import {
	AudioWaveform,
	ChevronDown,
	Command,
	Home,
	ListTodo,
	LogOut,
	Plus,
	Search,
	Sparkles,
	Trash2,
	User,
} from 'lucide-react'
import type * as React from 'react'
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
			isActive: true,
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
	return (
		<Sidebar className="border-r-0" {...props}>
			<SidebarHeader>
				<NavLogo />
				<NavMain items={data.navMain} />
			</SidebarHeader>
			<SidebarContent>
				{/* <NavFavorites favorites={data.favorites} /> */}
				{/* <NavWorkspaces workspaces={data.workspaces} /> */}
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}

import type { LucideIcon } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
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
}: {
	items: {
		title: string
		url: string
		icon: LucideIcon
		isActive?: boolean
	}[]
}) {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton asChild className="text-primary">
					<Dialog>
						<DialogTrigger className={cn(sidebarMenuButtonVariants())}>
							<div className="rounded-full bg-primary p-0.5 text-primary-foreground">
								<Plus className="size-4" />
							</div>
							Add task
						</DialogTrigger>
						<DialogContent className="p-0">
							<NewTaskCard onSubmit={async () => {}} onCancel={() => {}} />
						</DialogContent>
					</Dialog>
				</SidebarMenuButton>
			</SidebarMenuItem>
			{items.map((item) => (
				<SidebarMenuItem key={item.title}>
					<SidebarMenuButton asChild isActive={item.isActive}>
						<a href={item.url}>
							<item.icon />
							<span>{item.title}</span>
						</a>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
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
								<a href={item.url}>
									<item.icon />
									<span>{item.title}</span>
								</a>
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
