import { ValidationError } from './validation-error'

export class AlreadyExistsError extends ValidationError {
	constructor(path: string, message?: string) {
		const defaultMessage = `${path} já cadastrado.`
		super([{ path, message: message || defaultMessage }], message || defaultMessage)
		this.name = 'AlreadyExistsError'
	}
}
