import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchNearbyGyms } from '@/use-cases/factories/make-fetch-nearby-gyms'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude, page } = nearbyGymsQuerySchema.parse(
    request.query,
  )

  const fetchNearbyGymsUseCase = makeFetchNearbyGyms()

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
    page,
  })

  return reply.status(200).send({ gyms })
}
