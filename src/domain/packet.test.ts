import { describe, expect, it } from 'vitest'
import { createSignalPacket, parseSignalRequest } from './packet'

describe('signal packet', () => {
  it('normalizes and validates research requests', () => {
    expect(parseSignalRequest({ subject: '  Algorand x402  ', intent: 'creator-brief', freshness: '24h' }))
      .toEqual({ subject: 'Algorand x402', intent: 'creator-brief', freshness: '24h' })
    expect(() => parseSignalRequest({ subject: 'x' })).toThrow()
  })

  it('produces a deterministic evidence hash for equivalent input', () => {
    const first = createSignalPacket({ subject: 'Algorand x402', intent: 'research', freshness: '24h' })
    const second = createSignalPacket({ subject: '  algorand X402 ', intent: 'research', freshness: '24h' })
    expect(first.provenance.responseHash).toBe(second.provenance.responseHash)
    expect(first.signals.length).toBeGreaterThan(1)
    expect(first.signals.every(signal => signal.sources.length > 0)).toBe(true)
    expect(first.payment.status).toBe('preview')
  })
})
