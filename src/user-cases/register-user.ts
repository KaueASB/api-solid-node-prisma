import { User } from '@prisma/client'
import { hash } from 'bcrypt'

import { IUsersRepository } from '@/repositories/interface-users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'

export interface RegisterUserUseCaseRequestBody {
  name: string
  email: string
  password: string
}

export interface RegisterUserUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserUseCaseRequestBody): Promise<RegisterUserUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userSameWithEmail = await this.usersRepository.findByEmail(email)

    if (userSameWithEmail) throw new UserAlreadyExistsError()

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
