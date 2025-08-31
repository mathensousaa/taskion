import { cookies } from 'next/headers'
import { container } from 'tsyringe'
import { z } from 'zod'
import { ErrorHandler } from '@/backend/common/errors/error-handler'
import { UnauthorizedError } from '@/backend/common/errors/unauthorized-error'
import type { IUserRepository } from '@/backend/users/repository/user.repository'
import type { User } from '@/modules'

// Types and interfaces
interface IsAuthenticatedOptions {
	allowApiKey?: boolean
}

interface AuthenticatedUserResult {
	user: User
	source: 'session' | 'api_key'
}

// Zod schemas
const ApiKeyBypassSchema = z.object({
	user_id: z.uuid('Invalid user_id format'),
})

/**
 * Authentication decorator that validates the user against the database
 * Adds the authenticated user object to req.user
 *
 * When allowApiKey is true, supports API key bypass authentication:
 * - Client must provide valid x-api-key header
 * - Request body must contain valid user_id (UUID format)
 * - Automatically fetches and validates the user from the database
 * - Sets req.user with the authenticated user object
 *
 * Usage: @IsAuthenticated({ allowApiKey: true })
 * Access the user via req.user in your controller methods
 */
export function IsAuthenticated(options?: IsAuthenticatedOptions) {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value

		descriptor.value = async function (...args: any[]) {
			try {
				const authenticatedUser = await authenticateUser(options, args)
				injectUserIntoRequest(args, authenticatedUser.user)

				return originalMethod.apply(this, args)
			} catch (error) {
				return ErrorHandler.handle(error, 'IsAuthenticated')
			}
		}

		return descriptor
	}
}

/**
 * Main authentication logic - handles both session and API key authentication
 */
async function authenticateUser(
	options: IsAuthenticatedOptions | undefined,
	args: any[],
): Promise<AuthenticatedUserResult> {
	// Try session-based authentication first
	const sessionUser = await authenticateViaSession()
	if (sessionUser) {
		return { user: sessionUser, source: 'session' }
	}

	// Fall back to API key authentication if enabled
	if (options?.allowApiKey) {
		const apiKeyUser = await authenticateViaApiKey(args)
		if (apiKeyUser) {
			return { user: apiKeyUser, source: 'api_key' }
		}
	}

	throw new UnauthorizedError('Authentication required')
}

/**
 * Authenticate user via session cookie
 */
async function authenticateViaSession(): Promise<User | null> {
	try {
		const cookieStore = await cookies()
		const session = cookieStore.get('session')

		if (!session?.value) {
			return null
		}

		const userRepository = container.resolve<IUserRepository>('IUserRepository')
		const user = await userRepository.findByEmail(session.value)

		if (!user) {
			throw new UnauthorizedError('Invalid session - user not found')
		}

		return user
	} catch (error) {
		// Log session authentication errors but don't expose details
		console.error('Session authentication failed:', error)
		return null
	}
}

/**
 * Authenticate user via API key and user_id validation
 */
async function authenticateViaApiKey(args: any[]): Promise<User | null> {
	const request = findRequestInArgs(args)
	if (!request) {
		return null
	}

	const apiKey = request.headers.get('x-api-key')
	if (!apiKey || apiKey !== process.env.TASK_ENHANCER_SECRET) {
		return null
	}

	return await validateAndFetchUserFromBody(request)
}

/**
 * Validate request body and fetch user by user_id
 */
async function validateAndFetchUserFromBody(request: Request): Promise<User> {
	try {
		const body = await request.json()
		const { user_id } = ApiKeyBypassSchema.parse(body)

		const userRepository = container.resolve<IUserRepository>('IUserRepository')
		const user = await userRepository.findById(user_id)

		if (!user) {
			throw new UnauthorizedError('User not found with provided user_id')
		}

		// Restore request body for controller access
		restoreRequestBody(request, body)

		return user
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errorMessages = error.issues.map((issue: z.ZodIssue) => issue.message).join(', ')
			throw new UnauthorizedError(`Invalid request body: ${errorMessages}`)
		}

		if (error instanceof UnauthorizedError) {
			throw error
		}

		throw new UnauthorizedError('Failed to validate user_id for API key bypass')
	}
}

/**
 * Find Request object in method arguments
 */
function findRequestInArgs(args: any[]): Request | null {
	const requestIndex = args.findIndex((arg) => arg instanceof Request)
	return requestIndex !== -1 ? args[requestIndex] : null
}

/**
 * Inject authenticated user into request object
 */
function injectUserIntoRequest(args: any[], user: User): void {
	const request = findRequestInArgs(args)
	if (request) {
		request.user = user
	}
}

/**
 * Restore request body after consumption for controller access
 */
function restoreRequestBody(request: Request, body: any): void {
	request.json = () => Promise.resolve(body)
}
