import { Hono } from 'hono'
import { z } from 'zod'
import { createSignalPacket, parseSignalRequest } from '../domain/packet'
import { paymentConfig, type RuntimeConfig, runtimeConfig } from './config'

const errorMessage = (error: unknown) => error instanceof z.ZodError
  ? { code: 'INVALID_REQUEST', message: 'Request validation failed', issues: error.issues }
  : error instanceof SyntaxError
    ? { code: 'INVALID_REQUEST', message: 'Request body must be valid JSON' }
    : { code: 'INTERNAL_ERROR', message: 'Unable to process request' }

const errorStatus = (error: unknown): 400 | 500 =>
  error instanceof z.ZodError || error instanceof SyntaxError ? 400 : 500

export function createApp(config: RuntimeConfig = runtimeConfig()) {
  const app = new Hono()
  const merchantConfigured = Boolean(config.avmAddress)
  // This becomes true only when real verification/settlement middleware is wired.
  const paymentReady = false

  app.get('/api/health', c => c.json({ status: 'ok', mode: 'demo', merchantConfigured, paymentReady, timestamp: new Date().toISOString() }))
  app.get('/api/config', c => c.json({ ...paymentConfig, payTo: merchantConfigured ? config.avmAddress : null, merchantConfigured, paymentReady, mode: 'demo' }))
  app.get('/api/metrics', c => c.json({ paidVolume: 0, settledRequests: 0, uniquePayers: 0, successRate: null, mode: 'demo' }))
  app.get('/api/transactions', c => c.json({ items: [], mode: 'demo', message: 'No settled transactions. Preview requests are never counted as payments.' }))

  app.post('/api/signals/preview', async c => {
    try { return c.json(createSignalPacket(parseSignalRequest(await c.req.json()))) }
    catch (error) { return c.json(errorMessage(error), errorStatus(error)) }
  })

  app.post('/api/signals/research', async c => {
    if (!paymentReady) return c.json({
      code: 'PAYMENT_NOT_CONFIGURED',
      message: merchantConfigured
        ? 'Merchant address is configured, but verified x402 settlement middleware is not enabled.'
        : 'Set AVM_ADDRESS and enable verified x402 settlement middleware before accepting paid research.',
    }, 503)
    try {
      parseSignalRequest(await c.req.json())
      return c.json({ code: 'X402_ROUTE_PENDING', message: 'Payment address is configured, but settlement middleware must pass before this route serves data.' }, 503)
    } catch (error) { return c.json(errorMessage(error), errorStatus(error)) }
  })

  return app
}
