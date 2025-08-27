import { StatusBar } from 'expo-status-bar';
import { StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useMemo } from 'react';
import { CryptoAsset, PriceData, HoldingsData } from './src/types';
import { CryptoAssetItem } from './src/components/CryptoAssetItem';

// Import mock data
const mockPrices: PriceData = require('./src/mockData/mockPrices.json');
const mockHoldings: HoldingsData = require('./src/mockData/mockHoldings.json');

export default function App() {
  const cryptoAssets = useMemo(() => {
    return mockHoldings.holdings.map((holding) => {
      const priceData = mockPrices.prices[holding.symbol];

      if (!priceData) {
        throw new Error(`No price data found for ${holding.symbol}`);
      }

      const currentValue = holding.quantity * priceData.currentPrice;
      const purchaseCost = holding.quantity * holding.purchasePrice;
      const profitLoss = currentValue - purchaseCost;
      const percentageChange = ((currentValue - purchaseCost) / purchaseCost) * 100;

      // Calculate daily change percentage
      const dailyChange = ((priceData.currentPrice - priceData.price24hAgo) / priceData.price24hAgo) * 100;

      return {
        id: holding.id,
        name: holding.name,
        ticker: holding.symbol,
        currentPrice: priceData.currentPrice,
        dailyChange: dailyChange,
        quantity: holding.quantity,
        purchasePrice: holding.purchasePrice,
        currentValue: currentValue,
        purchaseCost: purchaseCost,
        profitLoss: profitLoss,
        percentageChange: percentageChange,
      } as CryptoAsset;
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
        data={cryptoAssets}
        renderItem={({ item }) => <CryptoAssetItem item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    padding: 20,
  },
});
