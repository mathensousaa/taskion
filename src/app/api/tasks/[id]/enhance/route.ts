import { taskController } from '@/server-container'

export async function POST(req: Request, { params }: { params: { id: string } }) {
	return await taskController.enhance(req, params.id)
}
