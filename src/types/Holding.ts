export interface Holding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
}

export interface HoldingsData {
  holdings: Holding[];
}
