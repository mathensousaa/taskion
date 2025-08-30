import { cookies } from 'next/headers'
import { UnauthorizedError } from '@/backend/common/errors/unauthorized-error'

/**
 * Authentication decorator that checks for valid HTTP-only cookies
 * Can be applied to controller methods to enforce authentication
 */
export function Authenticated() {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value

		descriptor.value = async function (...args: any[]) {
			const cookieStore = await cookies()
			const session = cookieStore.get('session')

			if (!session?.value) {
				throw new UnauthorizedError('Authentication required')
			}

			// Call the original method with the authenticated context
			return originalMethod.apply(this, args)
		}

		return descriptor
	}
}

/**
 * Authentication decorator that returns the authenticated user's email
 * Useful when you need the user context in the protected method
 */
export function AuthenticatedWithUser() {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value

		descriptor.value = async function (...args: any[]) {
			const cookieStore = await cookies()
			const session = cookieStore.get('session')

			if (!session?.value) {
				throw new UnauthorizedError('Authentication required')
			}

			// Add the authenticated user email to the method context
			const authenticatedUser = { email: session.value }

			// Call the original method with the authenticated context
			return originalMethod.apply(this, [authenticatedUser, ...args])
		}

		return descriptor
	}
}
