import { container } from 'tsyringe'
import { TrashController } from '@/backend/tasks/controllers/trash.controller'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const controller = container.resolve(TrashController)
	return controller.restoreTask(req, id)
}
