import { createHash, randomUUID } from 'node:crypto'
import { z } from 'zod'
import { evidence } from './evidence'
import type { SignalPacket, SignalRequest } from './types'

const requestSchema = z.object({
  subject: z.string().trim().min(3).max(160),
  intent: z.enum(['research', 'creator-brief', 'due-diligence']).default('research'),
  freshness: z.enum(['1h', '24h', '7d']).default('24h'),
}).strict()

export function parseSignalRequest(input: unknown): SignalRequest {
  return requestSchema.parse(input)
}

function fingerprint(request: SignalRequest): string {
  const canonical = JSON.stringify({ ...request, subject: request.subject.toLocaleLowerCase() })
  return `sha256:${createHash('sha256').update(canonical + JSON.stringify(evidence)).digest('hex')}`
}

export function createSignalPacket(input: SignalRequest): SignalPacket {
  const request = parseSignalRequest(input)
  const generatedAt = new Date().toISOString()
  const sources = new Set(evidence.flatMap(item => item.sources.map(source => source.url)))
  return {
    requestId: `sig_${randomUUID().replaceAll('-', '').slice(0, 16)}`,
    subject: request.subject,
    summary: `${evidence.length} material signals connect ${request.subject} to verifiable, pay-per-request agent commerce on Algorand.`,
    signals: evidence.map(item => ({ ...item, sources: item.sources.map(source => ({ ...source })) })),
    changes: [
      { type: 'new', description: 'Official AVM support is now available in the x402 Foundation SDK.' },
      { type: 'developing', description: 'Paid agent tools are expanding across HTTP, MCP and A2A transports.' },
    ],
    contentAngles: [
      'The API key is quietly being replaced by a wallet.',
      'Agents do not need subscriptions. They need prices they can understand and settle.',
      'Algorand turns HTTP 402 from an unused status code into a working checkout lane.',
    ],
    provenance: { sourceCount: sources.size, generatedAt, responseHash: fingerprint(request) },
    pricing: { amount: '$0.10', asset: 'USDC', network: 'Algorand Mainnet' },
    payment: { status: 'preview', transaction: null },
  }
}
