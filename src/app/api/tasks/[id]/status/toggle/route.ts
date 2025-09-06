import { taskController } from '@/server-container'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return await taskController.toggleStatus(req, id)
}
