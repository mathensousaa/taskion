import type { ErrorResponse } from './error-response'

export interface GeneralError extends ErrorResponse {
	statusCode: number
}
