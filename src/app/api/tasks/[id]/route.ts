import { taskController } from '@/server-container'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return await taskController.getById(req, id)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return await taskController.update(req, id)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return await taskController.delete(req, id)
}
