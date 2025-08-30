import { NextResponse } from 'next/server'
import type { ErrorResponse } from './error-response'
import type { GeneralError } from './general-error'

export class InternalServerError extends Error implements GeneralError {
	public statusCode: number
	public message: string

	constructor(message = 'Something went wrong on our side. Please try again later.') {
		super(message)

		this.statusCode = 500
		this.message = message
	}

	public toJSON(): ErrorResponse {
		return {
			message: this.message,
		}
	}

	public sendResponse() {
		return NextResponse.json(this.toJSON(), { status: this.statusCode })
	}
}
