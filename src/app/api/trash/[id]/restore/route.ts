import { trashController } from '@/server-container'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return trashController.restoreTask(req, id)
}
