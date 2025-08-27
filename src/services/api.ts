import { HoldingsData, PriceData } from '../types';

const API_BASE_URL = 'https://your-api-domain.com';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface ApiError {
  error: string;
  message: string;
  status: number;
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers here if needed
        // 'Authorization': `Bearer ${token}`,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<T> = await response.json();
    return data.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export const portfolioApi = {
  /**
   * Fetch user's portfolio holdings
   * GET /api/v1/portfolio/holdings
   */
  getHoldings: async (): Promise<HoldingsData> => {
    return apiRequest<HoldingsData>('/api/v1/portfolio/holdings');
  },
};

export const marketApi = {
  /**
   * Fetch current market prices for specified symbols
   * GET /api/v1/market/prices?symbols=BTC,ETH,ADA
   */
  getPrices: async (symbols: string[]): Promise<PriceData> => {
    const symbolsParam = symbols.join(',');
    return apiRequest<PriceData>(`/api/v1/market/prices?symbols=${symbolsParam}`);
  },
};

export const portfolioService = {
  /**
   * Fetch complete portfolio data including holdings and current prices
   */
  getPortfolioData: async (): Promise<{
    holdings: HoldingsData;
    prices: PriceData;
  }> => {
    try {
      const holdings = await portfolioApi.getHoldings();
      const symbols = holdings.holdings.map(holding => holding.symbol);

      const prices = await marketApi.getPrices(symbols);

      return { holdings, prices };
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error);
      throw error;
    }
  },
};

// Export default API configuration
export const apiConfig = {
  baseUrl: API_BASE_URL,
  timeout: 10000,
  retryAttempts: 3,
};

export default {
  portfolio: portfolioApi,
  market: marketApi,
  portfolioService,
};
