import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { usePortfolioLoading, useLastFetched } from '../store';

export const PortfolioFooter: React.FC = () => {
  const loading = usePortfolioLoading();
  const lastFetched = useLastFetched();

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
    paddingVertical: 16,
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
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 8,
  },
  lastUpdatedText: {
    fontSize: 14,
    color: '#6c757d',
  },
});
