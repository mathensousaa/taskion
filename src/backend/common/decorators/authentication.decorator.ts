import { cookies } from 'next/headers'
import { container } from 'tsyringe'
import { z } from 'zod'
import { ErrorHandler } from '@/backend/common/errors/error-handler'
import { NotFoundError } from '@/backend/common/errors/not-found-error'
import { UnauthorizedError } from '@/backend/common/errors/unauthorized-error'
import type { IUserRepository } from '@/backend/users/repository/user.repository'
import type { User } from '@/modules'

// Types and interfaces
interface IsAuthenticatedOptions {
	allowApiKeyWithUserId?: boolean
	allowEmailToken?: boolean
	allowApiKeyOnly?: boolean
}

interface AuthenticatedUserResult {
	user: User | null
	source: 'session' | 'api_key' | 'email_token' | 'api_key_only'
}

// Zod schemas
const ApiKeyBypassSchema = z.object({
	user_id: z.uuid('Invalid user_id format'),
})

const EmailTokenSchema = z.object({
	user_email: z.email('Invalid email format'),
})

// No schema needed for API key only authentication

/**
 * Authentication decorator that validates the user against the database
 * Adds the authenticated user object to req.user
 *
 * Supported authentication methods:
 * 1. Session-based authentication (default)
 * 2. Email token authentication: @IsAuthenticated({ allowEmailToken: true })
 *    - Client must provide valid x-email-token header
 *    - Request body must contain valid user_email
 *    - Automatically fetches and validates the user from the database
 * 3. API key + user_id authentication: @IsAuthenticated({ allowApiKeyWithUserId: true })
 *    - Client must provide valid x-api-key header
 *    - Request body must contain valid user_id (UUID format)
 *    - Automatically fetches and validates the user from the database
 * 4. API key only authentication: @IsAuthenticated({ allowApiKeyOnly: true })
 *    - Client must provide valid x-api-key header
 *    - No user validation required (req.user will be null)
 *
 * Usage examples:
 * @IsAuthenticated() // Session only
 * @IsAuthenticated({ allowEmailToken: true }) // Session + Email token
 * @IsAuthenticated({ allowApiKeyWithUserId: true }) // Session + API key + user_id
 * @IsAuthenticated({ allowApiKeyOnly: true }) // Session + API key only
 * @IsAuthenticated({ allowEmailToken: true, allowApiKeyWithUserId: true, allowApiKeyOnly: true }) // All methods
 *
 * Access the user via req.user in your controller methods
 */
export function IsAuthenticated(
	options: IsAuthenticatedOptions = {
		allowEmailToken: true,
		allowApiKeyWithUserId: false,
		allowApiKeyOnly: false,
	},
) {
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
 * Main authentication logic - handles session, API key, email token, and API key only authentication
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

	// Try email token authentication if enabled
	if (options?.allowEmailToken) {
		const emailTokenUser = await authenticateViaEmailToken(args)
		if (emailTokenUser) {
			return { user: emailTokenUser, source: 'email_token' }
		}
	}

	// Try API key + user_id authentication if enabled
	if (options?.allowApiKeyWithUserId) {
		const apiKeyUser = await authenticateViaApiKey(args)
		if (apiKeyUser) {
			return { user: apiKeyUser, source: 'api_key' }
		}
	}

	// Try API key only authentication if enabled
	if (options?.allowApiKeyOnly) {
		const apiKeyOnlyResult = await authenticateViaApiKeyOnly(args)
		if (apiKeyOnlyResult) {
			return { user: null, source: 'api_key_only' }
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
 * Authenticate user via email token
 */
async function authenticateViaEmailToken(args: any[]): Promise<User | null> {
	const request = findRequestInArgs(args)
	if (!request) {
		return null
	}

	const emailToken = request.headers.get('x-email-token')

	if (!emailToken || emailToken !== process.env.EMAIL_TOKEN_SECRET) {
		return null
	}

	return await validateAndFetchUserFromEmailBody(request)
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
 * Authenticate via API key only (no user required)
 */
async function authenticateViaApiKeyOnly(args: any[]): Promise<boolean> {
	const request = findRequestInArgs(args)

	if (!request) {
		return false
	}

	const apiKey = request.headers.get('x-api-key')

	console.log('apiKey', apiKey)

	if (!apiKey || apiKey !== process.env.TASK_ENHANCER_SECRET) {
		return false
	}

	// For API key only, we just validate the API key exists
	// No user validation required
	return true
}

/**
 * Validate request body and fetch user by user_email
 */
async function validateAndFetchUserFromEmailBody(request: Request): Promise<User> {
	try {
		const body = await request.json()
		const { user_email } = EmailTokenSchema.parse(body)

		const userRepository = container.resolve<IUserRepository>('IUserRepository')
		const user = await userRepository.findByEmail(user_email)

		if (!user) {
			throw new NotFoundError('User not found with provided user_email')
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

		throw new UnauthorizedError('Failed to validate user_email for email token authentication')
	}
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
			throw new NotFoundError('User not found with provided user_id')
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
function injectUserIntoRequest(args: any[], user: User | null): void {
	const request = findRequestInArgs(args)
	if (request) {
		request.user = user || undefined
	}
}

/**
 * Restore request body after consumption for controller access
 */
function restoreRequestBody(request: Request, body: any): void {
	request.json = () => Promise.resolve(body)
}
