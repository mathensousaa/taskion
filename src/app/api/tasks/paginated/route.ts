import { taskController } from '@/server-container'

export async function GET(req: Request) {
	return await taskController.getPaginated(req)
}
