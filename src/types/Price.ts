export interface Price {
  currentPrice: number;
  price24hAgo: number;
  lastUpdated: string;
}

export interface PriceData {
  prices: {
    [symbol: string]: Price;
  };
}
