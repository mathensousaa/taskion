'use client'

import {
	AudioWaveform,
	ChevronDown,
	Command,
	Home,
	ListTodo,
	LogOut,
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
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'

// This is sample data.
const data = {
	teams: [
		{
			name: 'Acme Inc',
			logo: Command,
			plan: 'Enterprise',
		},
		{
			name: 'Acme Corp.',
			logo: AudioWaveform,
			plan: 'Startup',
		},
		{
			name: 'Evil Corp.',
			logo: Command,
			plan: 'Free',
		},
	],
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
	],
	navSecondary: [
		{
			title: 'Trash',
			url: '/trash',
			icon: Trash2,
		},
	],
	favorites: [
		{
			name: 'Project Management & Task Tracking',
			url: '#',
			emoji: '📊',
		},
		{
			name: 'Family Recipe Collection & Meal Planning',
			url: '#',
			emoji: '🍳',
		},
		{
			name: 'Fitness Tracker & Workout Routines',
			url: '#',
			emoji: '💪',
		},
		{
			name: 'Book Notes & Reading List',
			url: '#',
			emoji: '📚',
		},
		{
			name: 'Sustainable Gardening Tips & Plant Care',
			url: '#',
			emoji: '🌱',
		},
		{
			name: 'Language Learning Progress & Resources',
			url: '#',
			emoji: '🗣️',
		},
		{
			name: 'Home Renovation Ideas & Budget Tracker',
			url: '#',
			emoji: '🏠',
		},
		{
			name: 'Personal Finance & Investment Portfolio',
			url: '#',
			emoji: '💰',
		},
		{
			name: 'Movie & TV Show Watchlist with Reviews',
			url: '#',
			emoji: '🎬',
		},
		{
			name: 'Daily Habit Tracker & Goal Setting',
			url: '#',
			emoji: '✅',
		},
	],
	workspaces: [
		{
			name: 'Personal Life Management',
			emoji: '🏠',
			pages: [
				{
					name: 'Daily Journal & Reflection',
					url: '#',
					emoji: '📔',
				},
				{
					name: 'Health & Wellness Tracker',
					url: '#',
					emoji: '🍏',
				},
				{
					name: 'Personal Growth & Learning Goals',
					url: '#',
					emoji: '🌟',
				},
			],
		},
		{
			name: 'Professional Development',
			emoji: '💼',
			pages: [
				{
					name: 'Career Objectives & Milestones',
					url: '#',
					emoji: '🎯',
				},
				{
					name: 'Skill Acquisition & Training Log',
					url: '#',
					emoji: '🧠',
				},
				{
					name: 'Networking Contacts & Events',
					url: '#',
					emoji: '🤝',
				},
			],
		},
		{
			name: 'Creative Projects',
			emoji: '🎨',
			pages: [
				{
					name: 'Writing Ideas & Story Outlines',
					url: '#',
					emoji: '✍️',
				},
				{
					name: 'Art & Design Portfolio',
					url: '#',
					emoji: '🖼️',
				},
				{
					name: 'Music Composition & Practice Log',
					url: '#',
					emoji: '🎵',
				},
			],
		},
		{
			name: 'Home Management',
			emoji: '🏡',
			pages: [
				{
					name: 'Household Budget & Expense Tracking',
					url: '#',
					emoji: '💰',
				},
				{
					name: 'Home Maintenance Schedule & Tasks',
					url: '#',
					emoji: '🔧',
				},
				{
					name: 'Family Calendar & Event Planning',
					url: '#',
					emoji: '📅',
				},
			],
		},
		{
			name: 'Travel & Adventure',
			emoji: '🧳',
			pages: [
				{
					name: 'Trip Planning & Itineraries',
					url: '#',
					emoji: '🗺️',
				},
				{
					name: 'Travel Bucket List & Inspiration',
					url: '#',
					emoji: '🌎',
				},
				{
					name: 'Travel Journal & Photo Gallery',
					url: '#',
					emoji: '📸',
				},
			],
		},
	],
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

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
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
