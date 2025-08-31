import { taskStatusController } from '@/server-container'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return await taskStatusController.getById(id)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return await taskStatusController.update(id, req)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return await taskStatusController.delete(id)
}
