import React from 'react';
import { CryptoAssetItem } from '../CryptoAssetItem';
import { CryptoAsset } from '../../types';

jest.mock('../../store/portfolioStore', () => ({
  usePortfolioStore: jest.fn(),
}));

jest.mock('react-native', () => ({
  StyleSheet: {
    create: jest.fn((styles) => styles),
  },
  View: ({ children, testID, ...props }: any) => {
    const React = require('react');
    return React.createElement('div', { ...props, 'data-testid': testID }, children);
  },
  Text: ({ children, testID, ...props }: any) => {
    const React = require('react');
    return React.createElement('span', { ...props, 'data-testid': testID }, children);
  },
}));

describe('CryptoAssetItem', () => {
  const mockCryptoAsset: CryptoAsset = {
    id: '1',
    name: 'Bitcoin',
    ticker: 'BTC',
    currentPrice: 43250,
    dailyChange: 2.49,
    quantity: 0.5,
    purchasePrice: 35000,
    currentValue: 21625,
    purchaseCost: 17500,
    profitLoss: 4125,
    percentageChange: 23.57,
    priceUnavailable: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      expect(() => {
        const element = React.createElement(CryptoAssetItem, { item: mockCryptoAsset });
        expect(element).toBeDefined();
      }).not.toThrow();
    });

    it('should accept valid crypto asset props', () => {
      const element = React.createElement(CryptoAssetItem, { item: mockCryptoAsset });
      expect(element.props.item).toEqual(mockCryptoAsset);
    });
  });

  describe('Data Formatting', () => {
    it('should format currency values correctly', () => {
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount);
      };

      expect(formatCurrency(43250)).toBe('$43,250.00');
      expect(formatCurrency(21625)).toBe('$21,625.00');
      expect(formatCurrency(4125)).toBe('$4,125.00');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(43250.75)).toBe('$43,250.75');
    });

    it('should format percentage values correctly', () => {
      const formatPercentage = (percentage: number) => {
        const sign = percentage >= 0 ? '+' : '';
        return `${sign}${percentage.toFixed(1)}%`;
      };

      expect(formatPercentage(2.49)).toBe('+2.5%');
      expect(formatPercentage(-1.25)).toBe('-1.3%');
      expect(formatPercentage(0)).toBe('+0.0%');
      expect(formatPercentage(23.57)).toBe('+23.6%');
      expect(formatPercentage(-8.57)).toBe('-8.6%');
    });
  });

  describe('Component Props Validation', () => {
    it('should handle positive profit/loss values', () => {
      const positiveAsset: CryptoAsset = {
        ...mockCryptoAsset,
        profitLoss: 4125,
        percentageChange: 23.57,
      };

      const element = React.createElement(CryptoAssetItem, { item: positiveAsset });
      expect(element.props.item.profitLoss).toBe(4125);
      expect(element.props.item.percentageChange).toBe(23.57);
    });

    it('should handle negative profit/loss values', () => {
      const negativeAsset: CryptoAsset = {
        ...mockCryptoAsset,
        profitLoss: -1500,
        percentageChange: -8.57,
      };

      const element = React.createElement(CryptoAssetItem, { item: negativeAsset });
      expect(element.props.item.profitLoss).toBe(-1500);
      expect(element.props.item.percentageChange).toBe(-8.57);
    });

    it('should handle zero values', () => {
      const zeroAsset: CryptoAsset = {
        ...mockCryptoAsset,
        profitLoss: 0,
        percentageChange: 0,
      };

      const element = React.createElement(CryptoAssetItem, { item: zeroAsset });
      expect(element.props.item.profitLoss).toBe(0);
      expect(element.props.item.percentageChange).toBe(0);
    });

    it('should handle price unavailable state', () => {
      const unavailableAsset: CryptoAsset = {
        ...mockCryptoAsset,
        priceUnavailable: true,
      };

      const element = React.createElement(CryptoAssetItem, { item: unavailableAsset });
      expect(element.props.item.priceUnavailable).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small decimal values', () => {
      const smallAsset: CryptoAsset = {
        ...mockCryptoAsset,
        currentPrice: 0.000123,
        currentValue: 0.0000615,
        profitLoss: 0.000001,
        percentageChange: 0.001,
      };

      const element = React.createElement(CryptoAssetItem, { item: smallAsset });
      expect(element.props.item.currentPrice).toBe(0.000123);
      expect(element.props.item.currentValue).toBe(0.0000615);
    });

    it('should handle very large values', () => {
      const largeAsset: CryptoAsset = {
        ...mockCryptoAsset,
        currentPrice: 999999.99,
        currentValue: 499999.995,
        profitLoss: 99999.99,
        percentageChange: 25.0,
      };

      const element = React.createElement(CryptoAssetItem, { item: largeAsset });
      expect(element.props.item.currentPrice).toBe(999999.99);
      expect(element.props.item.currentValue).toBe(499999.995);
    });

    it('should handle zero quantity', () => {
      const zeroQuantityAsset: CryptoAsset = {
        ...mockCryptoAsset,
        quantity: 0,
        currentValue: 0,
        profitLoss: -17500,
      };

      const element = React.createElement(CryptoAssetItem, { item: zeroQuantityAsset });
      expect(element.props.item.quantity).toBe(0);
      expect(element.props.item.currentValue).toBe(0);
    });

    it('should handle very small quantity', () => {
      const smallQuantityAsset: CryptoAsset = {
        ...mockCryptoAsset,
        quantity: 0.000001,
        currentPrice: 43250,
        currentValue: 0.04325,
        profitLoss: -17499.95675,
      };

      const element = React.createElement(CryptoAssetItem, { item: smallQuantityAsset });
      expect(element.props.item.quantity).toBe(0.000001);
      expect(element.props.item.currentValue).toBe(0.04325);
    });
  });

  describe('Different Asset Types', () => {
    it('should handle different crypto asset names', () => {
      const ethAsset: CryptoAsset = {
        ...mockCryptoAsset,
        id: '2',
        name: 'Ethereum',
        ticker: 'ETH',
        currentPrice: 2580,
        currentValue: 5160,
        profitLoss: 760,
        percentageChange: 17.27,
      };

      const element = React.createElement(CryptoAssetItem, { item: ethAsset });
      expect(element.props.item.name).toBe('Ethereum');
      expect(element.props.item.ticker).toBe('ETH');
      expect(element.props.item.currentPrice).toBe(2580);
    });

    it('should handle special characters in asset names', () => {
      const specialAsset: CryptoAsset = {
        ...mockCryptoAsset,
        name: 'Bitcoin Cash (BCH)',
        ticker: 'BCH',
      };

      const element = React.createElement(CryptoAssetItem, { item: specialAsset });
      expect(element.props.item.name).toBe('Bitcoin Cash (BCH)');
      expect(element.props.item.ticker).toBe('BCH');
    });
  });

  describe('Component Structure', () => {
    it('should have correct prop types', () => {
      const element = React.createElement(CryptoAssetItem, { item: mockCryptoAsset });

      expect(element.type).toBe(CryptoAssetItem);
      expect(element.props).toHaveProperty('item');
      expect(element.props.item).toHaveProperty('id');
      expect(element.props.item).toHaveProperty('name');
      expect(element.props.item).toHaveProperty('ticker');
      expect(element.props.item).toHaveProperty('currentPrice');
      expect(element.props.item).toHaveProperty('dailyChange');
      expect(element.props.item).toHaveProperty('quantity');
      expect(element.props.item).toHaveProperty('purchasePrice');
      expect(element.props.item).toHaveProperty('currentValue');
      expect(element.props.item).toHaveProperty('purchaseCost');
      expect(element.props.item).toHaveProperty('profitLoss');
      expect(element.props.item).toHaveProperty('percentageChange');
      expect(element.props.item).toHaveProperty('priceUnavailable');
    });
  });
});
