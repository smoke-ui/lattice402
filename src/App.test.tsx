import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

afterEach(() => vi.restoreAllMocks())

describe('Lattice402 dashboard', () => {
  it('explains the product and labels demo payment state', () => {
    render(<App />)
    expect(screen.getByText('Intelligence agents can buy one request at a time.')).toBeInTheDocument()
    expect(screen.getAllByText(/preview/i).length).toBeGreaterThan(0)
  })

  it('runs a preview and renders returned evidence', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      requestId: 'sig_test', subject: 'New topic', summary: 'Fresh evidence returned.',
      signals: [{ claim: 'A verified claim', confidence: 0.93, importance: 0.88, observedAt: '2026-07-18T00:00:00Z', sources: [{ title: 'Algorand', url: 'https://algorand.co' }] }],
      changes: [{ type: 'new', description: 'A material change' }], contentAngles: ['A strong angle'],
      provenance: { sourceCount: 1, generatedAt: '2026-07-18T00:00:00Z', responseHash: 'sha256:test' },
      pricing: { amount: '$0.10', asset: 'USDC', network: 'Algorand Mainnet' }, payment: { status: 'preview', transaction: null },
    }), { status: 200, headers: { 'content-type': 'application/json' } }))
    render(<App />)
    fireEvent.change(screen.getByLabelText('Research subject'), { target: { value: 'New topic' } })
    fireEvent.click(screen.getByRole('button', { name: 'Run preview' }))
    await waitFor(() => expect(screen.getByText('Fresh evidence returned.')).toBeInTheDocument())
    expect(screen.getByText('A verified claim')).toBeInTheDocument()
  })
})
