'use client'

import {
	QueryClient,
	QueryClientProvider,
	type QueryKey,
	useQueryClient,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { api } from '@/lib/axios'
import type { RawResponse } from '@/lib/axios/types'
import { queryKeyToUrl } from '@/lib/react-query/helpers'
import { parseResponseData } from '@/lib/utils'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: defaultQueryFn,
			retry: false,
			refetchOnWindowFocus: false,
			refetchOnMount: true,
			staleTime: 30 * 1000,
		},
	},
})

export async function defaultQueryFn<T>({ queryKey }: { queryKey: QueryKey }) {
	const url = queryKeyToUrl(queryKey)
	const response = await api.get<RawResponse<T>>(url)

	return parseResponseData<T>(response)
}

export const ReactQueryProvider = ({
	children,
}: {
	children: React.ReactNode
	dehydratedState?: unknown
}) => {
	const [qc] = useState(() => queryClient)
	return (
		<QueryClientProvider client={qc}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}

export const useGetCachedQueryData = (key: string | number) => {
	const queryClient = useQueryClient()

	const data = queryClient.getQueryData([key])
	return data
}
