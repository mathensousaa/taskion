import { trashController } from '@/server-container'

export async function GET(req: Request) {
	return await trashController.getTrash(req)
}

export async function DELETE(req: Request) {
	return await trashController.emptyTrash(req)
}
