import { Prisma } from '@prisma/client'

import { IUsersRepository } from './interface-users-repository'

export class InMemoryUsersRepository implements IUsersRepository {
  public users: IUsersRepository[] = []

  async create(data: Prisma.UserCreateInput) {
    this.users.push(data)
  }
}
