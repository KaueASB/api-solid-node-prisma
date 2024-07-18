import type { IncomingMessage, Server, ServerResponse } from 'node:http'

import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify, { type FastifyBaseLogger, type FastifyInstance } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { ZodError } from 'zod'

import { env } from '@/env'

import { checkInsRoutes } from './controllers/check-ins/routes'
import { gymsRoutes } from './controllers/gyms/routes'
import { usersRoutes } from './controllers/users/routes'

export function buildApp(): FastifyInstance<Server<typeof IncomingMessage, typeof ServerResponse>, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, ZodTypeProvider> {

  const app = fastify().withTypeProvider<ZodTypeProvider>()

  app.setSerializerCompiler(serializerCompiler)
  app.setValidatorCompiler(validatorCompiler)

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'GymCheck',
        description: 'API para gerenciamento de academias e check-ins',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  })

  app.register(fastifyJwt, {
    cookie: {
      cookieName: 'refreshToken',
      signed: false,
    },
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: '10m',
    },
  })

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  })

  app.register(fastifyCookie)

  app.register(usersRoutes)
  app.register(gymsRoutes)
  app.register(checkInsRoutes)

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

  return app
}
