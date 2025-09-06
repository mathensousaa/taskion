import { Edit, ListFilter, MoreHorizontal, Trash } from 'lucide-react'
import { useState } from 'react'
import type { TaskStatus } from '@/backend/task-status/validation/task-status.schema'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { CardAction } from '@/components/ui/card'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TaskActionsMenuProps {
	taskStatuses?: TaskStatus[]
	onEditTitle: () => void
	onStatusUpdate: (statusSlug: string) => void
	onDelete: () => void
	children: React.ReactNode
}

export function TaskActionsMenu({
	taskStatuses,
	onEditTitle,
	onStatusUpdate,
	onDelete,
	children,
}: TaskActionsMenuProps) {
	const StatusMenuItems = ({ isContextMenu = false }: { isContextMenu?: boolean }) => {
		const MenuItem = isContextMenu ? ContextMenuItem : DropdownMenuItem
		const MenuSub = isContextMenu ? ContextMenuSub : DropdownMenuSub
		const MenuSubTrigger = isContextMenu ? ContextMenuSubTrigger : DropdownMenuSubTrigger
		const MenuSubContent = isContextMenu ? ContextMenuSubContent : DropdownMenuSubContent

		const handleEditTitle = (e: React.MouseEvent) => {
			e.stopPropagation()
			onEditTitle()
		}

		return (
			<>
				<MenuItem onClick={handleEditTitle}>
					<Edit className="size-4" /> Edit title
				</MenuItem>
				<DropdownMenuSeparator />
				{taskStatuses && taskStatuses.length > 0 && (
					<MenuSub>
						<MenuSubTrigger onClick={(e) => e.stopPropagation()}>
							<ListFilter className="mr-2 size-4" />
							Update status
						</MenuSubTrigger>
						<MenuSubContent>
							{taskStatuses.map((status) => (
								<MenuItem
									key={status.id}
									onClick={(e) => {
										e.stopPropagation()
										onStatusUpdate(status.slug)
									}}
									className="flex items-center gap-2"
								>
									<StatusBadge name={status.name} color={status.color} />
								</MenuItem>
							))}
						</MenuSubContent>
					</MenuSub>
				)}
				<DropdownMenuSeparator />
				<MenuItem
					variant="destructive"
					onClick={(e) => {
						e.stopPropagation()
						onDelete()
					}}
				>
					<Trash className="size-4" />
					Move to trash
				</MenuItem>
			</>
		)
	}

	return (
		<ContextMenu>
			<ContextMenuTrigger>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				<StatusMenuItems isContextMenu />
			</ContextMenuContent>
		</ContextMenu>
	)
}

export function TaskActionsDropdown({
	taskStatuses,
	// onEditTitle,
	onStatusUpdate,
	onDelete,
}: Omit<TaskActionsMenuProps, 'children'>) {
	const [open, setOpen] = useState(false)

	// const handleEditTitle = (e: React.MouseEvent) => {
	// 	setOpen(false)
	// 	e.stopPropagation()
	// 	onEditTitle()
	// }

	const StatusMenuItems = () => {
		return (
			<>
				{/* <DropdownMenuItem onClick={handleEditTitle}>
					<Edit className="size-4" /> Edit title
				</DropdownMenuItem> */}
				{/* <DropdownMenuSeparator /> */}
				{taskStatuses && taskStatuses.length > 0 && (
					<DropdownMenuSub>
						<DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
							<ListFilter className="mr-2 size-4" /> Update status
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							{taskStatuses.map((status) => (
								<DropdownMenuItem
									key={status.id}
									onClick={(e) => {
										e.stopPropagation()
										onStatusUpdate(status.slug)
									}}
									className="flex items-center gap-2"
								>
									<StatusBadge name={status.name} color={status.color} />
								</DropdownMenuItem>
							))}
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				)}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					onClick={(e) => {
						e.stopPropagation()
						onDelete()
					}}
				>
					<Trash className="size-4" />
					Move to trash
				</DropdownMenuItem>
			</>
		)
	}

	return (
		<CardAction className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
			<DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0"
						onClick={(e) => e.stopPropagation()}
					>
						<MoreHorizontal className="h-4 w-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<StatusMenuItems />
				</DropdownMenuContent>
			</DropdownMenu>
		</CardAction>
	)
}
