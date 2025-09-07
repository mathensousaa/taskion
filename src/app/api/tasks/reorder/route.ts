import { taskController } from '@/server-container'

export async function POST(req: Request) {
	return await taskController.reorderBetween(req)
}
