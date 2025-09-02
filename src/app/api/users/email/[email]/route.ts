import { userController } from '@/server-container'

export async function GET(_req: Request, { params }: { params: Promise<{ email: string }> }) {
	const { email } = await params
	return await userController.getByEmail(email)
}
