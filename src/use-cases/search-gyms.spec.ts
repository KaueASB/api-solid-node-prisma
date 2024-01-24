import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able search for gyms', async () => {
    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -23.6971343,
      longitude: -46.5063204,
    })

    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -23.6971343,
      longitude: -46.5063204,
    })

    const { gyms } = await sut.execute({
      query: 'type',
      page: 1,
    })

    expect(gyms).toHaveLength(1)

    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'TypeScript Gym' }),
      ]),
    )
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let index = 1; index <= 22; index++) {
      await gymsRepository.create({
        title: `TypeScript Gym ${index}`,
        description: null,
        phone: null,
        latitude: -23.6971343,
        longitude: -46.5063204,
      })
    }

    const { gyms } = await sut.execute({
      query: 'type',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'TypeScript Gym 21' }),
        expect.objectContaining({ title: 'TypeScript Gym 22' }),
      ]),
    )
  })
})
