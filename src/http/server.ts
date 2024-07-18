import type { FastifyReply, FastifyRequest } from 'fastify'

import { app } from './app'

// const app = buildApp()

export default async (req: FastifyRequest, res: FastifyReply) => {
  try {
    await app.ready()
    app.server.emit('request', req, res)
  } catch (error) {
    console.error('Erro ao lidar com a requisição:', error)
  }
}
