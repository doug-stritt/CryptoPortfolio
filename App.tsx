import { StatusBar } from 'expo-status-bar';
import { StyleSheet, FlatList, SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { CryptoAssetItem } from './src/components/CryptoAssetItem';
import { PortfolioHeader } from './src/components/PortfolioHeader';
import { PortfolioFooter } from './src/components/PortfolioFooter';
import { useComputedCryptoAssets, usePortfolioLoading, usePortfolioError, usePortfolioStore } from './src/store';

export default function App() {
  const cryptoAssets = useComputedCryptoAssets();
  const loading = usePortfolioLoading();
  const error = usePortfolioError();
  const fetchPortfolioData = usePortfolioStore((state) => state.fetchPortfolioData);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

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
          <TouchableOpacity style={styles.retryButton} onPress={fetchPortfolioData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
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
  retryButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
