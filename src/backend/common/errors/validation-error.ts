import { NextResponse } from 'next/server'
import type { ErrorResponse } from './error-response'
import type { FieldError } from './field-error'
import type { GeneralError } from './general-error'

export class ValidationError extends Error implements GeneralError {
	public statusCode: number
	public message: string
	public errors?: FieldError[]

	constructor(errors?: FieldError[], message = 'Some fields have validation errors.') {
		super(message)

		this.statusCode = 400
		this.message = message
		this.errors = errors

		Object.setPrototypeOf(this, ValidationError.prototype)
	}

	public toJSON(): ErrorResponse {
		return {
			message: this.message,
			errors: this.errors,
		}
	}

	public static handle(error: ValidationError) {
		return NextResponse.json(error.toJSON(), { status: error.statusCode })
	}
}
