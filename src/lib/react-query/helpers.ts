import type { QueryKey } from '@tanstack/react-query'

export const queryKeyToUrl = (queryKey: QueryKey): string => {
	if (!Array.isArray(queryKey)) {
		throw new Error('queryKey deve ser um array')
	}

	const pathParts: string[] = []
	const queryParams: string[] = []

	for (const key of queryKey) {
		if (typeof key === 'string' && key.includes('=')) {
			queryParams.push(key)
		} else {
			pathParts.push(encodeURIComponent(key.toString()))
		}
	}

	const path = pathParts.join('/')
	const query = queryParams.join('&')

	return query ? `/${path}?${query}` : `/${path}`
}
