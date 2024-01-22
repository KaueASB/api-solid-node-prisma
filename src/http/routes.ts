import { FastifyInstance } from 'fastify'

import { register } from './controllers/register-user'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)

  app.get('/', (_, reply) => {
    return reply.send('Hello World')
  })
}
