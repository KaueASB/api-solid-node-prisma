import { hash } from 'bcrypt'

import { IUsersRepository } from '@/repositories/prisma/interface-users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'

export interface RegisterUserUseCaseRequestBody {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ name, email, password }: RegisterUserUseCaseRequestBody) {
    const password_hash = await hash(password, 6)

    const userSameWithEmail = await this.usersRepository.findByEmail(email)

    if (userSameWithEmail) throw new UserAlreadyExistsError()

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
