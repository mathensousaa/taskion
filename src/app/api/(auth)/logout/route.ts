import { authController } from '@/server-container'

export async function POST() {
	return await authController.logout()
}
