import { authController } from '@/server-container'

export async function GET() {
	return await authController.getCurrentUser()
}
