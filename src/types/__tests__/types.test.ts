import { Holding, HoldingsData, Price, PriceData } from '../index';

describe('Type Definitions', () => {
  describe('Holding Interface', () => {
    it('should accept valid holding data', () => {
      const validHolding: Holding = {
        id: '1',
        symbol: 'BTC',
        name: 'Bitcoin',
        quantity: 0.5,
        purchasePrice: 35000,
        purchaseDate: '2024-01-15T00:00:00Z',
      };

      expect(validHolding.id).toBe('1');
      expect(validHolding.symbol).toBe('BTC');
      expect(validHolding.name).toBe('Bitcoin');
      expect(validHolding.quantity).toBe(0.5);
      expect(validHolding.purchasePrice).toBe(35000);
      expect(validHolding.purchaseDate).toBe('2024-01-15T00:00:00Z');
    });

    it('should handle decimal quantities', () => {
      const holdingWithDecimals: Holding = {
        id: '2',
        symbol: 'ETH',
        name: 'Ethereum',
        quantity: 2.75,
        purchasePrice: 2200.50,
        purchaseDate: '2024-02-01T00:00:00Z',
      };

      expect(holdingWithDecimals.quantity).toBe(2.75);
      expect(holdingWithDecimals.purchasePrice).toBe(2200.50);
    });

    it('should handle zero values', () => {
      const zeroHolding: Holding = {
        id: '3',
        symbol: 'ADA',
        name: 'Cardano',
        quantity: 0,
        purchasePrice: 0,
        purchaseDate: '2024-03-10T00:00:00Z',
      };

      expect(zeroHolding.quantity).toBe(0);
      expect(zeroHolding.purchasePrice).toBe(0);
    });
  });

  describe('HoldingsData Interface', () => {
    it('should accept valid holdings data', () => {
      const validHoldingsData: HoldingsData = {
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

      expect(validHoldingsData.holdings).toHaveLength(2);
      expect(validHoldingsData.holdings[0].symbol).toBe('BTC');
      expect(validHoldingsData.holdings[1].symbol).toBe('ETH');
    });

    it('should handle empty holdings array', () => {
      const emptyHoldingsData: HoldingsData = {
        holdings: [],
      };

      expect(emptyHoldingsData.holdings).toHaveLength(0);
    });
  });

  describe('Price Interface', () => {
    it('should accept valid price data', () => {
      const validPrice: Price = {
        currentPrice: 43250,
        price24hAgo: 42200,
        lastUpdated: '2024-08-05T12:00:00Z',
      };

      expect(validPrice.currentPrice).toBe(43250);
      expect(validPrice.price24hAgo).toBe(42200);
      expect(validPrice.lastUpdated).toBe('2024-08-05T12:00:00Z');
    });

    it('should handle decimal prices', () => {
      const decimalPrice: Price = {
        currentPrice: 2580.75,
        price24hAgo: 2612.25,
        lastUpdated: '2024-08-05T12:00:00Z',
      };

      expect(decimalPrice.currentPrice).toBe(2580.75);
      expect(decimalPrice.price24hAgo).toBe(2612.25);
    });

    it('should handle zero prices', () => {
      const zeroPrice: Price = {
        currentPrice: 0,
        price24hAgo: 0,
        lastUpdated: '2024-08-05T12:00:00Z',
      };

      expect(zeroPrice.currentPrice).toBe(0);
      expect(zeroPrice.price24hAgo).toBe(0);
    });

    it('should handle negative prices', () => {
      const negativePrice: Price = {
        currentPrice: -100,
        price24hAgo: -110,
        lastUpdated: '2024-08-05T12:00:00Z',
      };

      expect(negativePrice.currentPrice).toBe(-100);
      expect(negativePrice.price24hAgo).toBe(-110);
    });
  });

  describe('PriceData Interface', () => {
    it('should accept valid price data with multiple symbols', () => {
      const validPriceData: PriceData = {
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

      expect(validPriceData.prices.BTC.currentPrice).toBe(43250);
      expect(validPriceData.prices.ETH.currentPrice).toBe(2580);
      expect(validPriceData.prices.ADA.currentPrice).toBe(0.52);
    });

    it('should handle empty prices object', () => {
      const emptyPriceData: PriceData = {
        prices: {},
      };

      expect(Object.keys(emptyPriceData.prices)).toHaveLength(0);
    });

    it('should handle single symbol price data', () => {
      const singlePriceData: PriceData = {
        prices: {
          BTC: {
            currentPrice: 43250,
            price24hAgo: 42200,
            lastUpdated: '2024-08-05T12:00:00Z',
          },
        },
      };

      expect(Object.keys(singlePriceData.prices)).toHaveLength(1);
      expect(singlePriceData.prices.BTC).toBeDefined();
    });
  });

  describe('Type Compatibility', () => {
    it('should allow assignment of compatible types', () => {
      const holding: Holding = {
        id: '1',
        symbol: 'BTC',
        name: 'Bitcoin',
        quantity: 0.5,
        purchasePrice: 35000,
        purchaseDate: '2024-01-15T00:00:00Z',
      };

      const holdingsData: HoldingsData = {
        holdings: [holding],
      };

      expect(holdingsData.holdings[0]).toEqual(holding);
    });

    it('should allow assignment of price data to price data object', () => {
      const btcPrice: Price = {
        currentPrice: 43250,
        price24hAgo: 42200,
        lastUpdated: '2024-08-05T12:00:00Z',
      };

      const priceData: PriceData = {
        prices: {
          BTC: btcPrice,
        },
      };

      expect(priceData.prices.BTC).toEqual(btcPrice);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      const largeHolding: Holding = {
        id: '999999',
        symbol: 'BTC',
        name: 'Bitcoin',
        quantity: 999999.999999,
        purchasePrice: 999999999.99,
        purchaseDate: '2024-01-15T00:00:00Z',
      };

      expect(largeHolding.quantity).toBe(999999.999999);
      expect(largeHolding.purchasePrice).toBe(999999999.99);
    });

    it('should handle very small decimal numbers', () => {
      const smallPrice: Price = {
        currentPrice: 0.000001,
        price24hAgo: 0.000002,
        lastUpdated: '2024-08-05T12:00:00Z',
      };

      expect(smallPrice.currentPrice).toBe(0.000001);
      expect(smallPrice.price24hAgo).toBe(0.000002);
    });

    it('should handle special characters in strings', () => {
      const specialHolding: Holding = {
        id: 'test-123_456',
        symbol: 'BTC-USD',
        name: 'Bitcoin (BTC) - Special Edition',
        quantity: 0.5,
        purchasePrice: 35000,
        purchaseDate: '2024-01-15T00:00:00Z',
      };

      expect(specialHolding.id).toBe('test-123_456');
      expect(specialHolding.symbol).toBe('BTC-USD');
      expect(specialHolding.name).toBe('Bitcoin (BTC) - Special Edition');
    });
  });
});
