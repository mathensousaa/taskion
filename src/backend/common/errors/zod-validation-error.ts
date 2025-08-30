import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { ValidationError } from './validation-error'

export class ZodValidationError extends ZodError {
	public static handle(error: ZodError) {
		const errorDetails = error.issues.map((issue) => ({
			path: issue.path.join('.'),
			message: issue.message,
		}))

		const validationError = new ValidationError(errorDetails)

		return NextResponse.json(
			{
				message: validationError.message,
				errors: errorDetails,
			},
			{ status: validationError.statusCode },
		)
	}
}
