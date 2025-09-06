'use client'

import { formatDistanceToNow } from 'date-fns'
import { ArrowUpRight, Clock, MoreHorizontal, Trash2 } from 'lucide-react'
import Link from 'next/link'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useListRecentTasks } from '@/modules/tasks/services'

export function NavRecents() {
	const { isMobile } = useSidebar()
	const { data: recentTasks, isLoading, error } = useListRecentTasks(5)

	const truncateTitle = (title: string, maxLength: number = 30) => {
		return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title
	}

	if (isLoading) {
		return (
			<SidebarGroup className="group-data-[collapsible=icon]:hidden">
				<SidebarGroupLabel>Recent Tasks</SidebarGroupLabel>
				<SidebarMenu>
					{Array.from({ length: 3 }).map((_, i) => (
						<SidebarMenuItem key={`skeleton-${i as React.Key}`}>
							<SidebarMenuButton disabled>
								<Skeleton className="h-4 w-4 rounded" />
								<Skeleton className="h-4 flex-1" />
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroup>
		)
	}

	if (error || !recentTasks || recentTasks.length === 0) {
		return (
			<SidebarGroup className="group-data-[collapsible=icon]:hidden">
				<SidebarGroupLabel>Recent Tasks</SidebarGroupLabel>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton disabled className="text-muted-foreground">
							<Clock className="h-4 w-4" />
							<span>No recent tasks</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>
		)
	}

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Recent Tasks</SidebarGroupLabel>
			<SidebarMenu>
				{recentTasks.map((task) => (
					<SidebarMenuItem key={task.id}>
						<SidebarMenuButton asChild>
							<Link href={`/?task=${task.id}`} title={task.title}>
								<div className="flex min-w-0 flex-1 flex-col items-start">
									<span className="w-full truncate text-sm">{truncateTitle(task.title)}</span>
									<span className="text-[10px] text-muted-foreground">
										{formatDistanceToNow(task.created_at, {
											addSuffix: true,
										})}
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover>
									<MoreHorizontal />
									<span className="sr-only">More</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-56 rounded-lg"
								side={isMobile ? 'bottom' : 'right'}
								align={isMobile ? 'end' : 'start'}
							>
								<DropdownMenuItem asChild>
									<Link href={`/?task=${task.id}`}>
										<ArrowUpRight className="text-muted-foreground" />
										<span>Open Task</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Trash2 className="text-muted-foreground" />
									<span>Move to Trash</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	)
}
