import { Gym } from '@prisma/client'

import { IGymsRepository } from '../interface-gyms-repository'

export class InMemoryGymsRepository implements IGymsRepository {
  public gyms: Gym[] = []

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id)

    if (!gym) {
      return null
    }

    return gym
  }
}
