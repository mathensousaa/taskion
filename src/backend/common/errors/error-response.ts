import type { FieldError } from '@/backend/common/errors/field-error'

export interface ErrorResponse {
	message: string
	errors?: FieldError[]
}
