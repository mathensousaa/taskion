import type { ErrorResponse } from './error-response'
import type { GeneralError } from './general-error'
import { NextResponse } from 'next/server'

export class NotFoundError extends Error implements GeneralError {
	public statusCode: number
	public message: string

	constructor(message = 'No results found.') {
		super(message)

		this.statusCode = 404
		this.message = message

		Object.setPrototypeOf(this, NotFoundError.prototype)
	}

	public toJSON(): ErrorResponse {
		return {
			message: this.message,
		}
	}

	public static handle(error: NotFoundError) {
		return NextResponse.json(error.toJSON(), { status: error.statusCode })
	}
}
