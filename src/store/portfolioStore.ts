import { create } from 'zustand';
import { HoldingsData, PriceData } from '../types';

// Import mock data for initial state
const mockHoldings: HoldingsData = require('../mockData/mockHoldings.json');
const mockPrices: PriceData = require('../mockData/mockPrices.json');

interface PortfolioState {
  // State
  holdings: HoldingsData | null;
  prices: PriceData | null;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;

  // Actions
  setHoldings: (holdings: HoldingsData) => void;
  setPrices: (prices: PriceData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastFetched: (date: Date) => void;

  // Async actions
  fetchHoldings: () => Promise<void>;
  fetchPrices: (symbols: string[]) => Promise<void>;
  fetchPortfolioData: () => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  // Initial state
  holdings: mockHoldings,
  prices: mockPrices,
  loading: false,
  error: null,
  lastFetched: null,

  // Synchronous actions
  setHoldings: (holdings) => set({ holdings }),
  setPrices: (prices) => set({ prices }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setLastFetched: (date) => set({ lastFetched: date }),

  // Async actions
  fetchHoldings: async () => {
    try {
      set({ loading: true, error: null });
      const { portfolioApi } = await import('../services/api');
      const holdings = await portfolioApi.getHoldings();
      set({ holdings, loading: false });
      set({ lastFetched: new Date() });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch holdings';
      set({ error: errorMessage, loading: false });
      console.error('Failed to fetch holdings:', error);
    }
  },

  fetchPrices: async (symbols: string[]) => {
    if (symbols.length === 0) return;

    try {
      set({ loading: true, error: null });
      const { marketApi } = await import('../services/api');
      const prices = await marketApi.getPrices(symbols);
      set({ prices, loading: false });
      set({ lastFetched: new Date() });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch prices';
      set({ error: errorMessage, loading: false });
      console.error('Failed to fetch prices:', error);
    }
  },

  fetchPortfolioData: async () => {
    try {
      set({ loading: true, error: null });
      const { portfolioService } = await import('../services/api');
      const { holdings, prices } = await portfolioService.getPortfolioData();
      set({ holdings, prices, loading: false });
      set({ lastFetched: new Date() });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch portfolio data';
      set({ error: errorMessage, loading: false });
      console.error('Failed to fetch portfolio data:', error);
    }
  },
}));

// Selector hooks for better performance
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

// Selector for computed crypto assets
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
      dailyChange: dailyChange,
      quantity: holding.quantity,
      purchasePrice: holding.purchasePrice,
      currentValue: currentValue,
      purchaseCost: purchaseCost,
      profitLoss: profitLoss,
      percentageChange: percentageChange,
      priceUnavailable: false,
    };
  });
};
