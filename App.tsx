import { StatusBar } from 'expo-status-bar';
import { StyleSheet, FlatList, SafeAreaView, Text, View } from 'react-native';
import { CryptoAssetItem } from './src/components/CryptoAssetItem';
import { PortfolioHeader } from './src/components/PortfolioHeader';
import { PortfolioFooter } from './src/components/PortfolioFooter';
import { useComputedCryptoAssets, usePortfolioLoading, usePortfolioError } from './src/store';

export default function App() {
  const cryptoAssets = useComputedCryptoAssets();
  const loading = usePortfolioLoading();
  const error = usePortfolioError();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading portfolio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <PortfolioHeader />
      <FlatList
        data={cryptoAssets}
        renderItem={({ item }) => <CryptoAssetItem item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      <PortfolioFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
