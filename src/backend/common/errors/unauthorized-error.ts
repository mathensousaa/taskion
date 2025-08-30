import { NextResponse } from 'next/server'
import type { ErrorResponse } from './error-response'
import type { GeneralError } from './general-error'

export class UnauthorizedError extends Error implements GeneralError {
	public statusCode: number
	public message: string

	constructor(message = 'You’re not authorized to access this.') {
		super(message)

		this.statusCode = 401
		this.message = message

		Object.setPrototypeOf(this, UnauthorizedError.prototype)
	}

	public toJSON(): ErrorResponse {
		return {
			message: this.message,
		}
	}

	public static handle(error: UnauthorizedError) {
		return NextResponse.json(error.toJSON(), { status: error.statusCode })
	}
}
