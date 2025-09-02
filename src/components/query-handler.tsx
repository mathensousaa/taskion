import { useMemo } from 'react'

interface QueryHandlerProps<T> {
	status: 'pending' | 'error' | 'success'
	data?: T
	loadingComponent?: React.ReactNode
	errorComponent?: React.ReactNode
	emptyComponent?: React.ReactNode
	successComponent?: React.ReactNode
}

export function QueryHandler<T>({
	status,
	data,
	loadingComponent,
	errorComponent,
	emptyComponent,
	successComponent,
}: QueryHandlerProps<T>) {
	const isEmpty = useMemo(() => {
		if (!data) return true

		if (Array.isArray(data)) return data.length === 0

		if (typeof data === 'object' && data !== null && 'data' in data) {
			const dataProperty = (data as { data: unknown }).data
			if (Array.isArray(dataProperty)) return dataProperty.length === 0
			return false
		}

		return false
	}, [data])

	if (status === 'pending') return <>{loadingComponent}</>
	if (status === 'error') return <>{errorComponent}</>

	if (isEmpty) return <>{emptyComponent}</>

	return <>{successComponent}</>
}
