import { useState, useEffect, useCallback } from 'react';
import { HoldingsData, PriceData } from '../types';
import { portfolioService } from './api';

interface PortfolioData {
  holdings: HoldingsData;
  prices: PriceData;
}

interface UsePortfolioDataReturn {
  data: PortfolioData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePortfolioData = (): UsePortfolioDataReturn => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const portfolioData = await portfolioService.getPortfolioData();
      setData(portfolioData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio data';
      setError(errorMessage);
      console.error('Portfolio data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

// Hook for fetching only holdings
export const useHoldings = () => {
  const [holdings, setHoldings] = useState<HoldingsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHoldings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { portfolioApi } = await import('./api');
      const holdingsData = await portfolioApi.getHoldings();
      setHoldings(holdingsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch holdings';
      setError(errorMessage);
      console.error('Holdings fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings]);

  return {
    holdings,
    loading,
    error,
    refetch: fetchHoldings,
  };
};

// Hook for fetching only prices
export const usePrices = (symbols: string[]) => {
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    if (symbols.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { marketApi } = await import('./api');
      const pricesData = await marketApi.getPrices(symbols);
      setPrices(pricesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prices';
      setError(errorMessage);
      console.error('Prices fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [symbols]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return {
    prices,
    loading,
    error,
    refetch: fetchPrices,
  };
};
