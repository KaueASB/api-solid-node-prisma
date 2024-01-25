import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/middlewares/verify-jwt'

import { authenticate } from './controllers/authenticate'
import { profile } from './controllers/profile'
import { register } from './controllers/register-user'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  /**  Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, profile)

  /** Basic response */
  app.get('/', (_, reply) => {
    return reply.send('Hello World')
  })
}
