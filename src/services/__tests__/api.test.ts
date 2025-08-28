import { portfolioApi, marketApi, portfolioService } from '../api';
import { HoldingsData, PriceData } from '../../types';

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('apiRequest', () => {
    it('should make successful API request', async () => {
      const mockResponse = {
        data: { test: 'data' },
        success: true,
        message: 'Success',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const result = await portfolioApi.getHoldings();
      expect(result).toEqual(mockResponse.data);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://your-api-domain.com/api/v1/portfolio/holdings',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should handle API error response', async () => {
      const errorResponse = {
        error: 'Bad Request',
        message: 'Invalid request',
        status: 400,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue(errorResponse),
      } as any);

      await expect(portfolioApi.getHoldings()).rejects.toThrow('Invalid request');
    });

    it('should handle network error', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(portfolioApi.getHoldings()).rejects.toThrow('Network error');
    });

    it('should handle response without error message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({}),
      } as any);

      await expect(portfolioApi.getHoldings()).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('portfolioApi', () => {
    it('should fetch holdings successfully', async () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: mockHoldings,
          success: true,
        }),
      } as any);

      const result = await portfolioApi.getHoldings();
      expect(result).toEqual(mockHoldings);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://your-api-domain.com/api/v1/portfolio/holdings',
        expect.any(Object)
      );
    });
  });

  describe('marketApi', () => {
    it('should fetch prices for single symbol', async () => {
      const mockPrices: PriceData = {
        prices: {
          BTC: {
            currentPrice: 43250,
            price24hAgo: 42200,
            lastUpdated: '2024-08-05T12:00:00Z',
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: mockPrices,
          success: true,
        }),
      } as any);

      const result = await marketApi.getPrices(['BTC']);
      expect(result).toEqual(mockPrices);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://your-api-domain.com/api/v1/market/prices?symbols=BTC',
        expect.any(Object)
      );
    });

    it('should fetch prices for multiple symbols', async () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: mockPrices,
          success: true,
        }),
      } as any);

      const result = await marketApi.getPrices(['BTC', 'ETH']);
      expect(result).toEqual(mockPrices);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://your-api-domain.com/api/v1/market/prices?symbols=BTC,ETH',
        expect.any(Object)
      );
    });

    it('should handle empty symbols array', async () => {
      const mockPrices: PriceData = { prices: {} };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: mockPrices,
          success: true,
        }),
      } as any);

      const result = await marketApi.getPrices([]);
      expect(result).toEqual(mockPrices);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://your-api-domain.com/api/v1/market/prices?symbols=',
        expect.any(Object)
      );
    });
  });

  describe('portfolioService', () => {
    it('should fetch complete portfolio data successfully', async () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: mockHoldings,
          success: true,
        }),
      } as any);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: mockPrices,
          success: true,
        }),
      } as any);

      const result = await portfolioService.getPortfolioData();
      expect(result).toEqual({
        holdings: mockHoldings,
        prices: mockPrices,
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        'https://your-api-domain.com/api/v1/portfolio/holdings',
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        'https://your-api-domain.com/api/v1/market/prices?symbols=BTC,ETH',
        expect.any(Object)
      );
    });

    it('should handle error when fetching holdings fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Holdings fetch failed'));

      await expect(portfolioService.getPortfolioData()).rejects.toThrow('Holdings fetch failed');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle error when fetching prices fails', async () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: mockHoldings,
          success: true,
        }),
      } as any);

      mockFetch.mockRejectedValueOnce(new Error('Prices fetch failed'));

      await expect(portfolioService.getPortfolioData()).rejects.toThrow('Prices fetch failed');
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle empty holdings array', async () => {
      const mockHoldings: HoldingsData = { holdings: [] };
      const mockPrices: PriceData = { prices: {} };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: mockHoldings,
          success: true,
        }),
      } as any);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: mockPrices,
          success: true,
        }),
      } as any);

      const result = await portfolioService.getPortfolioData();
      expect(result).toEqual({
        holdings: mockHoldings,
        prices: mockPrices,
      });

      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        'https://your-api-domain.com/api/v1/market/prices?symbols=',
        expect.any(Object)
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle non-Error objects in catch blocks', async () => {
      mockFetch.mockRejectedValueOnce('String error');

      await expect(portfolioApi.getHoldings()).rejects.toBe('String error');
    });

    it('should handle undefined error objects', async () => {
      mockFetch.mockRejectedValueOnce(undefined);

      await expect(portfolioApi.getHoldings()).rejects.toBe(undefined);
    });

    it('should handle null error objects', async () => {
      mockFetch.mockRejectedValueOnce(null);

      await expect(portfolioApi.getHoldings()).rejects.toBe(null);
    });
  });
});
