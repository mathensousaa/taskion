import { ApiError } from 'next/dist/server/api-utils'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { AlreadyExistsError } from '@/backend/common/errors/already-exists-error'
import { EmailAlreadyExistsError } from '@/backend/common/errors/email-already-exists-error'
import { InternalServerError } from '@/backend/common/errors/internal-server-error'
import { NotFoundError } from '@/backend/common/errors/not-found-error'
import { UnauthorizedError } from '@/backend/common/errors/unauthorized-error'
import { ValidationError } from '@/backend/common/errors/validation-error'
import { ZodValidationError } from '@/backend/common/errors/zod-validation-error'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ErrorHandler {
	static handle(error: unknown, context?: string) {
		if (error instanceof ZodError) return ZodValidationError.handle(error)
		if (error instanceof AlreadyExistsError)
			return NextResponse.json(error.toJSON(), { status: error.statusCode })
		if (error instanceof EmailAlreadyExistsError)
			return NextResponse.json(error.toJSON(), { status: error.statusCode })
		if (error instanceof ValidationError) return ValidationError.handle(error)
		if (error instanceof NotFoundError)
			return NextResponse.json(error.toJSON(), { status: error.statusCode })
		if (error instanceof UnauthorizedError)
			return NextResponse.json(error.toJSON(), { status: error.statusCode })
		if (error instanceof ApiError)
			return NextResponse.json(
				{
					message: error.message,
					errors: error.cause,
					status: error.statusCode,
				},
				{ status: error.statusCode },
			)
		if (error instanceof InternalServerError) return error.sendResponse()

		console.error(`Unhandled error${context ? ` in ${context}` : ''}:`, error)

		return new InternalServerError().sendResponse()
	}
}
