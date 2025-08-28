import { usePortfolioStore } from '../portfolioStore';
import {
  useHoldings,
  usePrices,
  usePortfolioLoading,
  usePortfolioError,
  useLastFetched,
  usePortfolioData,
  useComputedCryptoAssets,
} from '../selectors';
import { HoldingsData, PriceData } from '../../types';

jest.mock('../portfolioStore', () => ({
  usePortfolioStore: jest.fn(),
}));

describe('Selectors', () => {
  const mockUsePortfolioStore = usePortfolioStore as jest.MockedFunction<typeof usePortfolioStore>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockState = (partialState: Partial<ReturnType<typeof usePortfolioStore>>) => ({
    holdings: null,
    prices: null,
    loading: false,
    error: null,
    lastFetched: null,
    setHoldings: jest.fn(),
    setPrices: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    setLastFetched: jest.fn(),
    fetchHoldings: jest.fn(),
    fetchPrices: jest.fn(),
    fetchPortfolioData: jest.fn(),
    ...partialState,
  });

  describe('Basic Selectors', () => {
    it('should return holdings from store', () => {
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

      mockUsePortfolioStore.mockImplementation((selector) =>
        selector(createMockState({ holdings: mockHoldings }))
      );

      const result = useHoldings();
      expect(result).toEqual(mockHoldings);
    });

    it('should return prices from store', () => {
      const mockPrices: PriceData = {
        prices: {
          BTC: {
            currentPrice: 43250,
            price24hAgo: 42200,
            lastUpdated: '2024-08-05T12:00:00Z',
          },
        },
      };

      mockUsePortfolioStore.mockImplementation((selector) =>
        selector(createMockState({ prices: mockPrices }))
      );

      const result = usePrices();
      expect(result).toEqual(mockPrices);
    });

    it('should return loading state from store', () => {
      mockUsePortfolioStore.mockImplementation((selector) =>
        selector(createMockState({ loading: true }))
      );

      const result = usePortfolioLoading();
      expect(result).toBe(true);
    });

    it('should return error from store', () => {
      const errorMessage = 'Test error';
      mockUsePortfolioStore.mockImplementation((selector) =>
        selector(createMockState({ error: errorMessage }))
      );

      const result = usePortfolioError();
      expect(result).toBe(errorMessage);
    });

    it('should return last fetched date from store', () => {
      const testDate = new Date('2024-01-01T00:00:00Z');
      mockUsePortfolioStore.mockImplementation((selector) =>
        selector(createMockState({ lastFetched: testDate }))
      );

      const result = useLastFetched();
      expect(result).toEqual(testDate);
    });
  });

  describe('usePortfolioData', () => {
    it('should return combined portfolio data when both holdings and prices exist', () => {
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

      mockUsePortfolioStore.mockImplementation((selector) =>
        selector(createMockState({ holdings: mockHoldings, prices: mockPrices }))
      );

      const result = usePortfolioData();
      expect(result).toEqual({
        holdings: mockHoldings,
        prices: mockPrices,
      });
    });

    it('should return null when holdings are missing', () => {
      const mockPrices: PriceData = {
        prices: {
          BTC: {
            currentPrice: 43250,
            price24hAgo: 42200,
            lastUpdated: '2024-08-05T12:00:00Z',
          },
        },
      };

      mockUsePortfolioStore.mockImplementation((selector) =>
        selector(createMockState({ prices: mockPrices }))
      );

      const result = usePortfolioData();
      expect(result).toBeNull();
    });

    it('should return null when prices are missing', () => {
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

      mockUsePortfolioStore.mockImplementation((selector) =>
        selector(createMockState({ holdings: mockHoldings }))
      );

      const result = usePortfolioData();
      expect(result).toBeNull();
    });
  });

  describe('useComputedCryptoAssets', () => {
    it('should return empty array when holdings or prices are missing', () => {
      mockUsePortfolioStore.mockImplementation((selector) =>
        selector(createMockState({}))
      );

      const result = useComputedCryptoAssets();
      expect(result).toEqual([]);
    });

    it('should compute crypto assets with available price data', () => {
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

      mockUsePortfolioStore.mockImplementation((selector) =>
        selector(createMockState({ holdings: mockHoldings, prices: mockPrices }))
      );

      const result = useComputedCryptoAssets();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: '1',
        name: 'Bitcoin',
        ticker: 'BTC',
        currentPrice: 43250,
        quantity: 0.5,
        purchasePrice: 35000,
        currentValue: 21625,
        purchaseCost: 17500,
        profitLoss: 4125,
        priceUnavailable: false,
      });

      expect(result[0].dailyChange).toBeCloseTo(2.49, 1);
      expect(result[0].percentageChange).toBeCloseTo(23.57, 1);
    });

    it('should handle missing price data for a symbol', () => {
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

      mockUsePortfolioStore.mockImplementation((selector) =>
        selector(createMockState({ holdings: mockHoldings, prices: mockPrices }))
      );

      const result = useComputedCryptoAssets();

      expect(result).toHaveLength(2);

      expect(result[0].priceUnavailable).toBe(false);
      expect(result[0].currentPrice).toBe(43250);

      expect(result[1].priceUnavailable).toBe(true);
      expect(result[1].currentPrice).toBe(0);
      expect(result[1].currentValue).toBe(0);
      expect(result[1].profitLoss).toBe(0);
      expect(result[1].percentageChange).toBe(0);
      expect(result[1].dailyChange).toBe(0);
    });

    it('should handle multiple assets with mixed price availability', () => {
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
          {
            id: '3',
            symbol: 'ADA',
            name: 'Cardano',
            quantity: 1000,
            purchasePrice: 0.45,
            purchaseDate: '2024-03-10T00:00:00Z',
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

      mockUsePortfolioStore.mockImplementation((selector) =>
        selector(createMockState({ holdings: mockHoldings, prices: mockPrices }))
      );

      const result = useComputedCryptoAssets();

      expect(result).toHaveLength(3);

      expect(result[0].priceUnavailable).toBe(false);
      expect(result[0].ticker).toBe('BTC');

      expect(result[1].priceUnavailable).toBe(false);
      expect(result[1].ticker).toBe('ETH');
      expect(result[1].currentValue).toBe(5160);
      expect(result[1].profitLoss).toBe(760);

      expect(result[2].priceUnavailable).toBe(true);
      expect(result[2].ticker).toBe('ADA');
      expect(result[2].currentValue).toBe(0);
    });

    it('should handle zero purchase price edge case', () => {
      const mockHoldings: HoldingsData = {
        holdings: [
          {
            id: '1',
            symbol: 'BTC',
            name: 'Bitcoin',
            quantity: 1.0,
            purchasePrice: 0,
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

      mockUsePortfolioStore.mockImplementation((selector) =>
        selector(createMockState({ holdings: mockHoldings, prices: mockPrices }))
      );

      const result = useComputedCryptoAssets();

      expect(result[0].purchaseCost).toBe(0);
      expect(result[0].profitLoss).toBe(43250);
      expect(result[0].percentageChange).toBe(Infinity);
    });
  });
});
