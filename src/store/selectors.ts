import { usePortfolioStore } from './portfolioStore';

// Basic selector hooks
export const useHoldings = () => usePortfolioStore((state) => state.holdings);
export const usePrices = () => usePortfolioStore((state) => state.prices);
export const usePortfolioLoading = () => usePortfolioStore((state) => state.loading);
export const usePortfolioError = () => usePortfolioStore((state) => state.error);
export const useLastFetched = () => usePortfolioStore((state) => state.lastFetched);

// Computed selectors
export const usePortfolioData = () => {
  const holdings = useHoldings();
  const prices = usePrices();

  if (!holdings || !prices) return null;

  return {
    holdings,
    prices,
  };
};

export const useComputedCryptoAssets = () => {
  const holdings = useHoldings();
  const prices = usePrices();

  if (!holdings || !prices) return [];

  return holdings.holdings.map((holding) => {
    const priceData = prices.prices[holding.symbol];

    if (!priceData) {
      return {
        id: holding.id,
        name: holding.name,
        ticker: holding.symbol,
        currentPrice: 0,
        dailyChange: 0,
        quantity: holding.quantity,
        purchasePrice: holding.purchasePrice,
        currentValue: 0,
        purchaseCost: holding.quantity * holding.purchasePrice,
        profitLoss: 0,
        percentageChange: 0,
        priceUnavailable: true,
      };
    }

    const currentValue = holding.quantity * priceData.currentPrice;
    const purchaseCost = holding.quantity * holding.purchasePrice;
    const profitLoss = currentValue - purchaseCost;
    const percentageChange = ((currentValue - purchaseCost) / purchaseCost) * 100;
    const dailyChange = ((priceData.currentPrice - priceData.price24hAgo) / priceData.price24hAgo) * 100;

    return {
      id: holding.id,
      name: holding.name,
      ticker: holding.symbol,
      currentPrice: priceData.currentPrice,
      dailyChange,
      quantity: holding.quantity,
      purchasePrice: holding.purchasePrice,
      currentValue,
      purchaseCost,
      profitLoss,
      percentageChange,
      priceUnavailable: false,
    };
  });
};
