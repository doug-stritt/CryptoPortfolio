import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { usePortfolioLoading, useLastFetched, usePortfolioError, usePortfolioStore } from '../store';

export const PortfolioFooter: React.FC = () => {
  const loading = usePortfolioLoading();
  const lastFetched = useLastFetched();
  const error = usePortfolioError();
  const fetchPortfolioData = usePortfolioStore((state) => state.fetchPortfolioData);

  const getLastUpdatedText = () => {
    if (!lastFetched) {
      return 'Never';
    }

    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastFetched.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes === 1) {
      return '1 minute ago';
    } else {
      return `${diffInMinutes} minutes ago`;
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPortfolioData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#6c757d" />
          <Text style={styles.loadingText}>Updating data...</Text>
        </View>
      ) : (
        <Text style={styles.lastUpdatedText}>
          Last updated: {getLastUpdatedText()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 8,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#6c757d',
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
