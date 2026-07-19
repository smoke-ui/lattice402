export const evidence = [
  {
    claim: 'Algorand now supports the x402 exact payment scheme for HTTP-native, pay-per-request services.',
    confidence: 0.98,
    importance: 0.94,
    observedAt: '2026-07-18T18:40:00Z',
    sources: [
      { title: 'Algorand x402 developer guide', url: 'https://dev.algorand.co/resources/x402-on-algorand/', publishedAt: '2026-07-01' },
      { title: 'x402 Foundation AVM package', url: 'https://www.npmjs.com/package/@x402/avm', publishedAt: '2026-07-17' },
    ],
  },
  {
    claim: 'GoPlausible provides hosted verification, Mainnet settlement, Bazaar discovery, receipts and public analytics.',
    confidence: 0.96,
    importance: 0.91,
    observedAt: '2026-07-18T18:42:00Z',
    sources: [
      { title: 'GoPlausible Facilitator API', url: 'https://facilitator.goplausible.xyz/docs', publishedAt: '2026-07-18' },
    ],
  },
  {
    claim: 'Deterministic finality, USDC support and native atomic groups make Algorand suitable for synchronous agent commerce.',
    confidence: 0.92,
    importance: 0.89,
    observedAt: '2026-07-18T18:45:00Z',
    sources: [
      { title: 'Algorand agentic commerce overview', url: 'https://algorand.co/agentic-commerce/x402', publishedAt: '2026-02-12' },
    ],
  },
] as const
