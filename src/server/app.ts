import { Hono } from 'hono'
import { z } from 'zod'
import { createSignalPacket, parseSignalRequest } from '../domain/packet'
import { paymentConfig, type RuntimeConfig, runtimeConfig } from './config'

const errorMessage = (error: unknown) => error instanceof z.ZodError
  ? { code: 'INVALID_REQUEST', message: 'Request validation failed', issues: error.issues }
  : { code: 'INTERNAL_ERROR', message: 'Unable to process request' }

export function createApp(config: RuntimeConfig = runtimeConfig()) {
  const app = new Hono()
  const paymentReady = Boolean(config.avmAddress)

  app.get('/api/health', c => c.json({ status: 'ok', mode: paymentReady ? 'mainnet-ready' : 'demo', paymentReady, timestamp: new Date().toISOString() }))
  app.get('/api/config', c => c.json({ ...paymentConfig, payTo: paymentReady ? config.avmAddress : null, paymentReady, mode: paymentReady ? 'mainnet-ready' : 'demo' }))
  app.get('/api/metrics', c => c.json({ paidVolume: 0, settledRequests: 0, uniquePayers: 0, successRate: null, mode: 'demo' }))
  app.get('/api/transactions', c => c.json({ items: [], mode: 'demo', message: 'No settled transactions. Preview requests are never counted as payments.' }))

  app.post('/api/signals/preview', async c => {
    try { return c.json(createSignalPacket(parseSignalRequest(await c.req.json()))) }
    catch (error) { return c.json(errorMessage(error), error instanceof z.ZodError ? 400 : 500) }
  })

  app.post('/api/signals/research', async c => {
    if (!paymentReady) return c.json({ code: 'PAYMENT_NOT_CONFIGURED', message: 'Set AVM_ADDRESS and enable x402 middleware before accepting paid research.' }, 503)
    try {
      parseSignalRequest(await c.req.json())
      return c.json({ code: 'X402_ROUTE_PENDING', message: 'Payment address is configured, but settlement middleware must pass before this route serves data.' }, 503)
    } catch (error) { return c.json(errorMessage(error), error instanceof z.ZodError ? 400 : 500) }
  })

  return app
}
