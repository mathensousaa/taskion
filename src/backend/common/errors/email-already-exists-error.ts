import { AlreadyExistsError } from './already-exists-error'

export class EmailAlreadyExistsError extends AlreadyExistsError {
  constructor(field: string, message = 'E-mail já cadastrado.') {
    super(field, message)

    Object.setPrototypeOf(this, EmailAlreadyExistsError.prototype)
    this.name = 'EmailAlreadyExistsError'
  }
}
