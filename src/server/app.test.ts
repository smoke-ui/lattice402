// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createApp } from './app'

describe('Signal402 API', () => {
  const app = createApp({ avmAddress: '' })

  it('reports truthful readiness and network configuration', async () => {
    const health = await app.request('/api/health')
    expect(health.status).toBe(200)
    expect(await health.json()).toMatchObject({ status: 'ok', mode: 'demo', paymentReady: false })

    const config = await app.request('/api/config')
    expect(await config.json()).toMatchObject({ scheme: 'exact', asset: { symbol: 'USDC', id: 31566704 }, paymentReady: false })
  })

  it('does not claim payment readiness when only a merchant address exists', async () => {
    const configuredAddress = createApp({ avmAddress: 'A'.repeat(58) })
    const health = await configuredAddress.request('/api/health')
    expect(await health.json()).toMatchObject({ mode: 'demo', paymentReady: false, merchantConfigured: true })
  })

  it('maps malformed JSON to a stable client error', async () => {
    const response = await app.request('/api/signals/preview', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: '{broken',
    })
    expect(response.status).toBe(400)
    expect(await response.json()).toMatchObject({ code: 'INVALID_REQUEST' })
  })

  it('returns an evidence-backed preview', async () => {
    const response = await app.request('/api/signals/preview', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ subject: 'Algorand agentic commerce', intent: 'creator-brief', freshness: '24h' }),
    })
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.payment.status).toBe('preview')
    expect(body.provenance.responseHash).toMatch(/^sha256:/)
  })

  it('refuses to imply settlement when payment is unconfigured', async () => {
    const response = await app.request('/api/signals/research', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ subject: 'Algorand x402', intent: 'research', freshness: '24h' }),
    })
    expect(response.status).toBe(503)
    expect(await response.json()).toMatchObject({ code: 'PAYMENT_NOT_CONFIGURED' })
  })
})
