export type Price = number
export type Quantiy = number

export type Bid = { price: Price; quantity: Quantiy }
export type Ask = { price: Price; quantity: Quantiy }

export type Bids = Bid[]
export type Asks = Ask[]

export interface SpreadData {
  asks: Asks
  bids: Bids
}
