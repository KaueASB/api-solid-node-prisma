import { env } from '@/env'

import { app } from './app'

// const app = buildApp()

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP Server Running at port :${env.PORT}!`)
  })
