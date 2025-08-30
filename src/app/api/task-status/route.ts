import { taskStatusController } from '@/server-container'

export async function GET() {
	return await taskStatusController.getAll()
}

export async function POST(req: Request) {
	return await taskStatusController.create(req)
}
