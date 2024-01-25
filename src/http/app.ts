import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from '@/env'

import { gymsRoutes } from './controllers/gyms/routes'
import { usersRoutes } from './controllers/users/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

// app.register(checkInsRoutes)
app.register(gymsRoutes)
app.register(usersRoutes)

app.get('/', (_, reply) => {
  return reply.send('Hello World')
})

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') console.error(error)

  return reply.status(500).send({ message: 'Internal server error.' })
})
