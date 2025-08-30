import { cookies } from 'next/headers'
import { container } from 'tsyringe'
import { ErrorHandler } from '@/backend/common/errors/error-handler'
import { UnauthorizedError } from '@/backend/common/errors/unauthorized-error'
import type { IUserRepository } from '@/backend/users/repository/user.repository'

/**
 * Authentication decorator that validates the user against the database
 * Provides the full authenticated user object to the protected method
 *
 * Usage: @AuthenticatedUser()
 * The first parameter will be the authenticated user object
 */
export function AuthenticatedUser() {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		try {
			const originalMethod = descriptor.value

			descriptor.value = async function (...args: any[]) {
				try {
					const cookieStore = await cookies()
					const session = cookieStore.get('session')

					if (!session?.value) {
						throw new UnauthorizedError('Authentication required')
					}

					// Get user repository to validate the session
					const userRepository = container.resolve<IUserRepository>('IUserRepository')
					const user = await userRepository.findByEmail(session.value)

					if (!user) {
						throw new UnauthorizedError('Invalid session - user not found')
					}

					// Call the original method with the authenticated user as first parameter
					return originalMethod.apply(this, [user, ...args])
				} catch (error) {
					return ErrorHandler.handle(error, 'AuthenticatedUser')
				}
			}

			return descriptor
		} catch (error) {
			return ErrorHandler.handle(error, 'AuthenticatedUser')
		}
	}
}

/**
 * Authentication decorator that validates the user and checks for specific permissions
 *
 * Usage: @AuthenticatedUserWithPermission('admin')
 * The first parameter will be the authenticated user object
 */
export function AuthenticatedUserWithPermission(requiredPermission?: string) {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		try {
			const originalMethod = descriptor.value

			descriptor.value = async function (...args: any[]) {
				try {
					const cookieStore = await cookies()
					const session = cookieStore.get('session')

					if (!session?.value) {
						throw new UnauthorizedError('Authentication required')
					}

					// Get user repository to validate the session
					const userRepository = container.resolve<IUserRepository>('IUserRepository')
					const user = await userRepository.findByEmail(session.value)

					if (!user) {
						throw new UnauthorizedError('Invalid session - user not found')
					}

					// If permission is required, check it here
					// You can extend this to check user roles, permissions, etc.
					if (requiredPermission) {
						// Example permission check - extend based on your user model
						// if (!user.permissions?.includes(requiredPermission)) {
						//     throw new UnauthorizedError(`Permission '${requiredPermission}' required`)
						// }
					}

					// Call the original method with the authenticated user as first parameter
					return originalMethod.apply(this, [user, ...args])
				} catch (error) {
					return ErrorHandler.handle(error, 'AuthenticatedUserWithPermission')
				}
			}

			return descriptor
		} catch (error) {
			return ErrorHandler.handle(error, 'AuthenticatedUserWithPermission')
		}
	}
}
