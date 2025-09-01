import { trashController } from '@/server-container'

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return await trashController.permanentlyDeleteTask(req, id)
}
