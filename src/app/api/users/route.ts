import { userController } from '@/server-container'

export async function GET() {
	return await userController.getAll()
}

export async function POST(req: Request) {
	return await userController.create(req)
}
