import { userController } from '@/server-container'

export async function GET(req: Request, { params }: { params: { id: string } }) {
	return await userController.getById(params.id)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
	return await userController.update(params.id, req)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
	return await userController.delete(params.id)
}
