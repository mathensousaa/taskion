export type APISuccessResponse<T> = {
	message: string
	data: T
}

export interface CreateManyResponse {
	message: string
	created: number[]
	already_exists: number[]
}

export interface DeleteManyResponse {
	message: string
	deleted: number[]
	not_found: number[]
}

import type { AxiosError, AxiosResponse } from 'axios'

type RawError = {
	message: string
}

export type APIError = AxiosError<RawError>

export type DefaultResponse<Data> = {
	data: Data
}

export type PaginationResponse<Data> = {
	ct: number
	data: Data
}

export type FetcherResponse<Data> = Promise<AxiosResponse<Data>>
export type RawResponse<Data> = DefaultResponse<Data>
export type PaginationRawResponse<Data> = PaginationResponse<Data>
export type APIResponse<Data> = FetcherResponse<RawResponse<Data>>

export type FieldErrorsResponse<TFields> = Partial<Record<keyof TFields, string[]>>
