import { randomUUID } from 'node:crypto'

import { Gym, Prisma } from '@prisma/client'

import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

import {
  FindManyNearbyParams,
  IGymsRepository,
} from '../interface-gyms-repository'

export class InMemoryGymsRepository implements IGymsRepository {
  public gyms: Gym[] = []

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async findManyNearby(params: FindManyNearbyParams) {
    const DISTANCE_IN_KILOMETERS = 10

    return this.gyms
      .filter((gym) => {
        const distance = getDistanceBetweenCoordinates(
          { latitude: params.latitude, longitude: params.longitude },
          {
            latitude: gym.latitude.toNumber(),
            longitude: gym.longitude.toNumber(),
          },
        )

        return distance <= DISTANCE_IN_KILOMETERS
      })
      .slice((params.page - 1) * 20, params.page * 20)
  }

  async searchMany(query: string, page: number) {
    return this.gyms
      .filter((gym) => gym.title.toLowerCase().includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.gyms.push(gym)

    return gym
  }
}
