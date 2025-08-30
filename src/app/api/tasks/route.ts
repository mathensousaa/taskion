import { taskController } from '@/server-container'

export async function GET(req: Request) {
	return await taskController.getAll(req)
}

export async function POST(req: Request) {
	return await taskController.create(req)
}

export async function PATCH(req: Request) {
	return await taskController.reorder(req)
}
