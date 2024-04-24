import type { Asks, Bids } from '@/types'

export function calculateSpread(bids: Bids, asks: Asks) {
  if (asks.length > 0 && bids.length > 0) {
    const bestAsk = asks[0]
    const bestBid = bids[0]
    return bestAsk.price - bestBid.price
  }
  return null
}

export function calculateTops(arr: Asks | Bids) {
  return arr.slice(0, 3)
}
