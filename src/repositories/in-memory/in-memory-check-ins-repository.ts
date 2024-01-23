import { randomUUID } from 'node:crypto'

import { CheckIn, Prisma } from '@prisma/client'
import { isSameDay } from 'date-fns'

import { ICheckInsRepository } from '../interface-check-ins-repository'

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public checkIns: CheckIn[] = []

  async findByUserIdOnDate(userId: string, date: Date) {
    const checkInOnSameDate = this.checkIns.find((checkIn) => {
      return checkIn.user_id === userId && isSameDay(checkIn.created_at, date)
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  async findManyByUserId(userId: string) {
    const checkIns = this.checkIns.filter(
      (checkIn) => checkIn.user_id === userId,
    )

    return checkIns
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.checkIns.push(checkIn)

    return checkIn
  }
}
