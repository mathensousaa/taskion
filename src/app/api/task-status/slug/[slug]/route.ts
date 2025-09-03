import { taskStatusController } from '@/server-container'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	return await taskStatusController.getBySlug(slug)
}
