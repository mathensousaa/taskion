import { taskController } from '@/server-container'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return await taskController.enhance(req, id)
}
