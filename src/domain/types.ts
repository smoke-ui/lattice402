export type Freshness = '1h' | '24h' | '7d'
export type Intent = 'research' | 'creator-brief' | 'due-diligence'

export interface SignalRequest { subject: string; intent: Intent; freshness: Freshness }
export interface Source { title: string; url: string; publishedAt?: string }
export interface Signal { claim: string; confidence: number; importance: number; observedAt: string; sources: Source[] }
export interface SignalPacket {
  requestId: string
  subject: string
  summary: string
  signals: Signal[]
  changes: Array<{ type: 'new' | 'developing' | 'stable'; description: string }>
  contentAngles: string[]
  provenance: { sourceCount: number; generatedAt: string; responseHash: string }
  pricing: { amount: string; asset: 'USDC'; network: 'Algorand Mainnet' }
  payment: { status: 'preview'; transaction: null }
}
