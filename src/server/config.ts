import { ALGORAND_MAINNET_CAIP2, USDC_MAINNET_ASA_ID } from '@x402/avm'

export const paymentConfig = {
  facilitatorUrl: 'https://facilitator.goplausible.xyz',
  network: ALGORAND_MAINNET_CAIP2,
  asset: { symbol: 'USDC' as const, id: Number(USDC_MAINNET_ASA_ID), decimals: 6 },
  scheme: 'exact' as const,
  price: '$0.10',
}

export interface RuntimeConfig { avmAddress: string }
export const runtimeConfig = (): RuntimeConfig => ({ avmAddress: process.env.AVM_ADDRESS?.trim() ?? '' })
