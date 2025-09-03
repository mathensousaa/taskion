export const keyListTaskStatuses = () => ['task-status']

export const keyGetTaskStatusById = (id: string | undefined) => ['task-status', id]

export const keyGetTaskStatusBySlug = (slug: string | undefined) => ['task-status', 'slug', slug]
