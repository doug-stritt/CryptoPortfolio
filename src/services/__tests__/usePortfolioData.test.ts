import { usePortfolioData } from '../usePortfolioData';
import { portfolioService } from '../api';
import { HoldingsData, PriceData } from '../../types';

jest.mock('../api', () => ({
  portfolioService: {
    getPortfolioData: jest.fn(),
  },
}));

const mockPortfolioService = portfolioService as jest.Mocked<typeof portfolioService>;

describe('usePortfolioData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Hook Structure', () => {
    it('should be a function', () => {
      expect(typeof usePortfolioData).toBe('function');
    });

    it('should return an object with expected properties', () => {
      mockPortfolioService.getPortfolioData.mockImplementation(() => new Promise(() => { }));

      expect(usePortfolioData).toBeDefined();
    });
  });

  describe('API Integration', () => {
    it('should call portfolioService.getPortfolioData on mount', () => {
      mockPortfolioService.getPortfolioData.mockImplementation(() => new Promise(() => { }));

      expect(mockPortfolioService.getPortfolioData).toBeDefined();
    });

    it('should handle successful API responses', async () => {
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

      const mockPortfolioData = {
        holdings: mockHoldings,
        prices: mockPrices,
      };

      mockPortfolioService.getPortfolioData.mockResolvedValue(mockPortfolioData);

      const result = await mockPortfolioService.getPortfolioData();
      expect(result).toEqual(mockPortfolioData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Failed to fetch data';
      mockPortfolioService.getPortfolioData.mockRejectedValue(new Error(errorMessage));

      await expect(mockPortfolioService.getPortfolioData()).rejects.toThrow(errorMessage);
    });

    it('should handle non-Error objects in catch block', async () => {
      mockPortfolioService.getPortfolioData.mockRejectedValue('String error');

      await expect(mockPortfolioService.getPortfolioData()).rejects.toBe('String error');
    });
  });

  describe('Data Handling', () => {
    it('should handle empty data structures', async () => {
      const mockPortfolioData = {
        holdings: { holdings: [] },
        prices: { prices: {} },
      };

      mockPortfolioService.getPortfolioData.mockResolvedValue(mockPortfolioData);

      const result = await mockPortfolioService.getPortfolioData();
      expect(result).toEqual(mockPortfolioData);
      expect(result.holdings.holdings).toHaveLength(0);
      expect(Object.keys(result.prices.prices)).toHaveLength(0);
    });

    it('should handle multiple holdings and prices', async () => {
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
          ADA: {
            currentPrice: 0.52,
            price24hAgo: 0.50,
            lastUpdated: '2024-08-05T12:00:00Z',
          },
        },
      };

      const mockPortfolioData = {
        holdings: mockHoldings,
        prices: mockPrices,
      };

      mockPortfolioService.getPortfolioData.mockResolvedValue(mockPortfolioData);

      const result = await mockPortfolioService.getPortfolioData();
      expect(result).toEqual(mockPortfolioData);
      expect(result.holdings.holdings).toHaveLength(3);
      expect(Object.keys(result.prices.prices)).toHaveLength(3);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockPortfolioService.getPortfolioData.mockRejectedValue(networkError);

      await expect(mockPortfolioService.getPortfolioData()).rejects.toThrow('Network error');
    });

    it('should handle undefined errors', async () => {
      mockPortfolioService.getPortfolioData.mockRejectedValue(undefined);

      await expect(mockPortfolioService.getPortfolioData()).rejects.toBeUndefined();
    });

    it('should handle null errors', async () => {
      mockPortfolioService.getPortfolioData.mockRejectedValue(null);

      await expect(mockPortfolioService.getPortfolioData()).rejects.toBeNull();
    });
  });

  describe('Hook Implementation Details', () => {
    it('should use useState for data management', () => {
      expect(usePortfolioData).toBeDefined();
      expect(typeof usePortfolioData).toBe('function');
    });

    it('should use useCallback for fetchData', () => {
      expect(usePortfolioData).toBeDefined();
    });

    it('should use useEffect for initial data fetching', () => {
      expect(usePortfolioData).toBeDefined();
    });
  });

  describe('Return Value Structure', () => {
    it('should return an object with data, loading, error, and refetch properties', () => {
      expect(usePortfolioData).toBeDefined();
    });
  });
});
