import { usePortfolioStore } from '../store/portfolioStore';
import { HoldingsData, PriceData } from '../types';

describe('Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    usePortfolioStore.setState({
      holdings: null,
      prices: null,
      loading: false,
      error: null,
      lastFetched: null,
    });
  });

  describe('Store and Data Integration', () => {
    it('should handle complete portfolio data flow through store', async () => {
      const mockHoldings: HoldingsData = {
        holdings: [
          {
            id: '1',
            symbol: 'BTC',
            name: 'Bitcoin',
            quantity: 0.5,
            purchasePrice: 35000,
            purchaseDate: '2024-01-15T00:00:00Z',
          },
          {
            id: '2',
            symbol: 'ETH',
            name: 'Ethereum',
            quantity: 2.0,
            purchasePrice: 2200,
            purchaseDate: '2024-02-01T00:00:00Z',
          },
        ],
      };

      const mockPrices: PriceData = {
        prices: {
          BTC: {
            currentPrice: 43250,
            price24hAgo: 42200,
            lastUpdated: '2024-08-05T12:00:00Z',
          },
          ETH: {
            currentPrice: 2580,
            price24hAgo: 2612,
            lastUpdated: '2024-08-05T12:00:00Z',
          },
        },
      };

      usePortfolioStore.getState().setHoldings(mockHoldings);
      usePortfolioStore.getState().setPrices(mockPrices);

      expect(usePortfolioStore.getState().holdings).toEqual(mockHoldings);
      expect(usePortfolioStore.getState().prices).toEqual(mockPrices);
      expect(usePortfolioStore.getState().loading).toBe(false);
      expect(usePortfolioStore.getState().error).toBeNull();
    });

    it('should handle partial data scenarios', async () => {
      const mockHoldings: HoldingsData = {
        holdings: [
          {
            id: '1',
            symbol: 'BTC',
            name: 'Bitcoin',
            quantity: 0.5,
            purchasePrice: 35000,
            purchaseDate: '2024-01-15T00:00:00Z',
          },
          {
            id: '2',
            symbol: 'ETH',
            name: 'Ethereum',
            quantity: 2.0,
            purchasePrice: 2200,
            purchaseDate: '2024-02-01T00:00:00Z',
          },
        ],
      };

      const mockPrices: PriceData = {
        prices: {
          BTC: {
            currentPrice: 43250,
            price24hAgo: 42200,
            lastUpdated: '2024-08-05T12:00:00Z',
          },
        },
      };

      usePortfolioStore.getState().setHoldings(mockHoldings);
      usePortfolioStore.getState().setPrices(mockPrices);

      expect(usePortfolioStore.getState().holdings).toEqual(mockHoldings);
      expect(usePortfolioStore.getState().prices).toEqual(mockPrices);
      expect(usePortfolioStore.getState().loading).toBe(false);
      expect(usePortfolioStore.getState().error).toBeNull();
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency across store updates', async () => {
      const mockHoldings: HoldingsData = {
        holdings: [
          {
            id: '1',
            symbol: 'BTC',
            name: 'Bitcoin',
            quantity: 1.0,
            purchasePrice: 40000,
            purchaseDate: '2024-01-15T00:00:00Z',
          },
        ],
      };

      const mockPrices: PriceData = {
        prices: {
          BTC: {
            currentPrice: 50000,
            price24hAgo: 48000,
            lastUpdated: '2024-08-05T12:00:00Z',
          },
        },
      };

      usePortfolioStore.getState().setHoldings(mockHoldings);
      usePortfolioStore.getState().setPrices(mockPrices);

      expect(usePortfolioStore.getState().holdings).toEqual(mockHoldings);
      expect(usePortfolioStore.getState().prices).toEqual(mockPrices);

      const updatedPrices: PriceData = {
        prices: {
          BTC: {
            currentPrice: 55000,
            price24hAgo: 50000,
            lastUpdated: '2024-08-05T13:00:00Z',
          },
        },
      };

      usePortfolioStore.getState().setPrices(updatedPrices);

      expect(usePortfolioStore.getState().prices).toEqual(updatedPrices);
      expect(usePortfolioStore.getState().holdings).toEqual(mockHoldings);
    });

    it('should handle edge cases in data management', async () => {
      const edgeCaseHoldings: HoldingsData = {
        holdings: [
          {
            id: '1',
            symbol: 'BTC',
            name: 'Bitcoin',
            quantity: 0,
            purchasePrice: 0,
            purchaseDate: '2024-01-15T00:00:00Z',
          },
          {
            id: '2',
            symbol: 'ETH',
            name: 'Ethereum',
            quantity: 1.0,
            purchasePrice: 1000,
            purchaseDate: '2024-02-01T00:00:00Z',
          },
        ],
      };

      const edgeCasePrices: PriceData = {
        prices: {
          BTC: {
            currentPrice: 50000,
            price24hAgo: 50000,
            lastUpdated: '2024-08-05T12:00:00Z',
          },
          ETH: {
            currentPrice: 0,
            price24hAgo: 1000,
            lastUpdated: '2024-08-05T12:00:00Z',
          },
        },
      };

      usePortfolioStore.getState().setHoldings(edgeCaseHoldings);
      usePortfolioStore.getState().setPrices(edgeCasePrices);

      expect(usePortfolioStore.getState().holdings).toEqual(edgeCaseHoldings);
      expect(usePortfolioStore.getState().prices).toEqual(edgeCasePrices);
    });
  });

  describe('Store State Management', () => {
    it('should handle loading state transitions', async () => {
      usePortfolioStore.getState().setLoading(true);
      expect(usePortfolioStore.getState().loading).toBe(true);

      usePortfolioStore.getState().setLoading(false);
      expect(usePortfolioStore.getState().loading).toBe(false);
    });

    it('should handle error state transitions', async () => {
      usePortfolioStore.getState().setError('Network error');
      expect(usePortfolioStore.getState().error).toBe('Network error');

      usePortfolioStore.getState().setError(null);
      expect(usePortfolioStore.getState().error).toBeNull();
    });

    it('should handle last fetched date updates', async () => {
      const testDate = new Date('2024-01-01T00:00:00Z');
      usePortfolioStore.getState().setLastFetched(testDate);
      expect(usePortfolioStore.getState().lastFetched).toEqual(testDate);
    });

    it('should handle multiple state updates in sequence', async () => {
      usePortfolioStore.getState().setLoading(true);
      expect(usePortfolioStore.getState().loading).toBe(true);

      usePortfolioStore.getState().setError('API Error');
      expect(usePortfolioStore.getState().error).toBe('API Error');
      expect(usePortfolioStore.getState().loading).toBe(true);

      usePortfolioStore.getState().setLoading(false);
      usePortfolioStore.getState().setError(null);
      expect(usePortfolioStore.getState().loading).toBe(false);
      expect(usePortfolioStore.getState().error).toBeNull();
    });
  });

  describe('Data Flow Integration', () => {
    it('should handle complete data flow from holdings to prices', async () => {
      const holdings: HoldingsData = {
        holdings: [
          {
            id: '1',
            symbol: 'BTC',
            name: 'Bitcoin',
            quantity: 0.5,
            purchasePrice: 35000,
            purchaseDate: '2024-01-15T00:00:00Z',
          },
        ],
      };

      usePortfolioStore.getState().setHoldings(holdings);
      expect(usePortfolioStore.getState().holdings).toEqual(holdings);
      expect(usePortfolioStore.getState().prices).toBeNull();

      const prices: PriceData = {
        prices: {
          BTC: {
            currentPrice: 43250,
            price24hAgo: 42200,
            lastUpdated: '2024-08-05T12:00:00Z',
          },
        },
      };

      usePortfolioStore.getState().setPrices(prices);
      expect(usePortfolioStore.getState().prices).toEqual(prices);
      expect(usePortfolioStore.getState().holdings).toEqual(holdings);

      usePortfolioStore.getState().setLoading(false);
      expect(usePortfolioStore.getState().loading).toBe(false);

      const now = new Date();
      usePortfolioStore.getState().setLastFetched(now);
      expect(usePortfolioStore.getState().lastFetched).toEqual(now);
    });

    it('should handle error recovery flow', async () => {
      usePortfolioStore.getState().setError('Network error');
      usePortfolioStore.getState().setLoading(false);
      expect(usePortfolioStore.getState().error).toBe('Network error');
      expect(usePortfolioStore.getState().loading).toBe(false);

      usePortfolioStore.getState().setError(null);
      usePortfolioStore.getState().setLoading(true);
      expect(usePortfolioStore.getState().error).toBeNull();
      expect(usePortfolioStore.getState().loading).toBe(true);

      const holdings: HoldingsData = {
        holdings: [
          {
            id: '1',
            symbol: 'BTC',
            name: 'Bitcoin',
            quantity: 0.5,
            purchasePrice: 35000,
            purchaseDate: '2024-01-15T00:00:00Z',
          },
        ],
      };

      usePortfolioStore.getState().setHoldings(holdings);
      usePortfolioStore.getState().setLoading(false);
      expect(usePortfolioStore.getState().holdings).toEqual(holdings);
      expect(usePortfolioStore.getState().loading).toBe(false);
      expect(usePortfolioStore.getState().error).toBeNull();
    });
  });
});
