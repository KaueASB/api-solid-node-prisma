import { Gym } from '@prisma/client'

import { IGymsRepository } from '@/repositories/interface-gyms-repository'

export interface SearchGymsUseCaseRequest {
  query: string
  page: number
}

export interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
