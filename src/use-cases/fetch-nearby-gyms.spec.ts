import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -23.6891543,
      longitude: -46.5069305,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -23.1867991,
      longitude: -46.2025623,
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.6971343,
      userLongitude: -46.5063204,
      page: 1,
    })

    expect(gyms).toHaveLength(1)

    expect(gyms).toEqual(
      expect.arrayContaining([expect.objectContaining({ title: 'Near Gym' })]),
    )
  })

  it('should be able to fetch paginated nearby gyms', async () => {
    for (let index = 1; index <= 22; index++) {
      await gymsRepository.create({
        title: `Near Gym ${index}`,
        description: null,
        phone: null,
        latitude: -23.6891543,
        longitude: -46.5069305,
      })
    }

    for (let index = 1; index <= 5; index++) {
      await gymsRepository.create({
        title: `Far Gym ${index}`,
        description: null,
        phone: null,
        latitude: -23.1867991,
        longitude: -46.2025623,
      })
    }

    const { gyms } = await sut.execute({
      userLatitude: -23.6971343,
      userLongitude: -46.5063204,
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Near Gym 21' }),
        expect.objectContaining({ title: 'Near Gym 22' }),
      ]),
    )
  })
})
