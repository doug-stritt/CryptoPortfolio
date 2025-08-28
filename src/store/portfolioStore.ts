import { create } from 'zustand';
import { HoldingsData, PriceData } from '../types';

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
  holdings: mockHoldings,
  prices: mockPrices,
  loading: false,
  error: null,
  lastFetched: null,

  setHoldings: (holdings) => set({ holdings }),
  setPrices: (prices) => set({ prices }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setLastFetched: (date) => set({ lastFetched: date }),

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
