import { usePortfolioStore } from '../portfolioStore';
import { HoldingsData, PriceData } from '../../types';

describe('PortfolioStore', () => {
  beforeEach(() => {
    usePortfolioStore.setState({
      holdings: null,
      prices: null,
      loading: false,
      error: null,
      lastFetched: null,
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = usePortfolioStore.getState();
      expect(state.holdings).toBeNull();
      expect(state.prices).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.lastFetched).toBeNull();
    });
  });

  describe('Synchronous Actions', () => {
    it('should set holdings correctly', () => {
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
        ],
      };

      usePortfolioStore.getState().setHoldings(mockHoldings);
      expect(usePortfolioStore.getState().holdings).toEqual(mockHoldings);
    });

    it('should set prices correctly', () => {
      const mockPrices: PriceData = {
        prices: {
          BTC: {
            currentPrice: 43250,
            price24hAgo: 42200,
            lastUpdated: '2024-08-05T12:00:00Z',
          },
        },
      };

      usePortfolioStore.getState().setPrices(mockPrices);
      expect(usePortfolioStore.getState().prices).toEqual(mockPrices);
    });

    it('should set loading state correctly', () => {
      usePortfolioStore.getState().setLoading(true);
      expect(usePortfolioStore.getState().loading).toBe(true);

      usePortfolioStore.getState().setLoading(false);
      expect(usePortfolioStore.getState().loading).toBe(false);
    });

    it('should set error correctly', () => {
      const errorMessage = 'Test error message';
      usePortfolioStore.getState().setError(errorMessage);
      expect(usePortfolioStore.getState().error).toBe(errorMessage);

      usePortfolioStore.getState().setError(null);
      expect(usePortfolioStore.getState().error).toBeNull();
    });

    it('should set last fetched date correctly', () => {
      const testDate = new Date('2024-01-01T00:00:00Z');
      usePortfolioStore.getState().setLastFetched(testDate);
      expect(usePortfolioStore.getState().lastFetched).toEqual(testDate);
    });
  });

  describe('Async Actions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('fetchHoldings', () => {
      it('should handle empty symbols array in fetchPrices', async () => {
        await usePortfolioStore.getState().fetchPrices([]);
        expect(usePortfolioStore.getState().loading).toBe(false);
      });
    });
  });

  describe('Store State Management', () => {
    it('should maintain state consistency', () => {
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
      usePortfolioStore.getState().setLoading(true);
      usePortfolioStore.getState().setError('Test error');

      const state = usePortfolioStore.getState();
      expect(state.holdings).toEqual(mockHoldings);
      expect(state.prices).toEqual(mockPrices);
      expect(state.loading).toBe(true);
      expect(state.error).toBe('Test error');

      // Update state
      usePortfolioStore.getState().setLoading(false);
      usePortfolioStore.getState().setError(null);

      const updatedState = usePortfolioStore.getState();
      expect(updatedState.loading).toBe(false);
      expect(updatedState.error).toBeNull();
      expect(updatedState.holdings).toEqual(mockHoldings);
      expect(updatedState.prices).toEqual(mockPrices);
    });

    it('should handle multiple state updates', () => {
      const holdings1: HoldingsData = {
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

      const holdings2: HoldingsData = {
        holdings: [
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

      usePortfolioStore.getState().setHoldings(holdings1);
      expect(usePortfolioStore.getState().holdings).toEqual(holdings1);

      usePortfolioStore.getState().setHoldings(holdings2);
      expect(usePortfolioStore.getState().holdings).toEqual(holdings2);
    });

    it('should handle error state transitions', () => {
      usePortfolioStore.getState().setError('Network error');
      expect(usePortfolioStore.getState().error).toBe('Network error');

      usePortfolioStore.getState().setError(null);
      expect(usePortfolioStore.getState().error).toBeNull();

      usePortfolioStore.getState().setError('API error');
      expect(usePortfolioStore.getState().error).toBe('API error');
    });

    it('should handle loading state transitions', () => {
      usePortfolioStore.getState().setLoading(true);
      expect(usePortfolioStore.getState().loading).toBe(true);

      usePortfolioStore.getState().setLoading(false);
      expect(usePortfolioStore.getState().loading).toBe(false);

      usePortfolioStore.getState().setLoading(true);
      expect(usePortfolioStore.getState().loading).toBe(true);
    });
  });
});
