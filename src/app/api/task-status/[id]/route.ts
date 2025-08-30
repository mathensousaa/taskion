import { taskStatusController } from '@/server-container'

export async function GET(req: Request, { params }: { params: { id: string } }) {
	return await taskStatusController.getById(params.id)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
	return await taskStatusController.update(params.id, req)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
	return await taskStatusController.delete(params.id)
}
