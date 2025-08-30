import { taskController } from '@/server-container'

export async function GET(req: Request, { params }: { params: { id: string } }) {
	return await taskController.getById(params.id)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
	return await taskController.update(params.id, req)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
	return await taskController.delete(params.id)
}
