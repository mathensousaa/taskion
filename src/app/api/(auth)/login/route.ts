import { authController } from '@/server-container'

export async function POST(req: Request) {
	return await authController.login(req)
}
