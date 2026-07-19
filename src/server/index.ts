import 'dotenv/config'
import { serve } from '@hono/node-server'
import { createApp } from './app'

const port = Number(process.env.PORT ?? 4021)
serve({ fetch: createApp().fetch, port }, info => {
  console.log(`Lattice402 API listening on http://localhost:${info.port}`)
})
