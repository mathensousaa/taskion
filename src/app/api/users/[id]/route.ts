import { userController } from '@/server-container'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return await userController.getById(id)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return await userController.update(id, req)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return await userController.delete(id)
}
