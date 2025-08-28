export interface CryptoAsset {
  id: string;
  name: string;
  ticker: string;
  currentPrice: number;
  dailyChange: number;
  quantity: number;
  purchasePrice: number;
  currentValue: number;
  purchaseCost: number;
  profitLoss: number;
  percentageChange: number;
  priceUnavailable: boolean;
}