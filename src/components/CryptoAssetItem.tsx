import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CryptoAsset } from '../types/CryptoAsset';

interface CryptoAssetItemProps {
  item: CryptoAsset;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatPercentage = (percentage: number) => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(1)}%`;
};

export const CryptoAssetItem: React.FC<CryptoAssetItemProps> = ({ item }) => {
  const isPositive = item.dailyChange >= 0;
  const isProfit = item.profitLoss >= 0;

  // Helper function to display price or unavailable message
  const displayPrice = (price: number) => {
    if (item.priceUnavailable) {
      return 'Price unavailable';
    }
    return formatCurrency(price);
  };

  // Helper function to display percentage or unavailable message
  const displayPercentage = (percentage: number) => {
    if (item.priceUnavailable) {
      return 'N/A';
    }
    return formatPercentage(percentage);
  };

  return (
    <View style={styles.assetContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.assetInfo}>
          <Text style={styles.assetName}>{item.name}</Text>
          <Text style={styles.assetTicker}>{item.ticker}</Text>
        </View>
        <View style={styles.priceInfo}>
          <Text style={[styles.currentPrice, item.priceUnavailable && styles.unavailableText]}>
            {displayPrice(item.currentPrice)}
          </Text>
          {!item.priceUnavailable && (
            <View style={[styles.dailyChangeBadge, isPositive ? styles.positiveChange : styles.negativeChange]}>
              <Text style={[styles.dailyChangeText, isPositive ? styles.positiveText : styles.negativeText]}>
                {displayPercentage(item.dailyChange)}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailColumn}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>QUANTITY</Text>
            <Text style={styles.detailValue}>
              {item.quantity} {item.ticker}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>PURCHASE PRICE</Text>
            <Text style={styles.detailValue}>{formatCurrency(item.purchasePrice)}</Text>
          </View>
        </View>
        <View style={styles.detailColumn}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>CURRENT VALUE</Text>
            <Text style={[styles.detailValue, item.priceUnavailable && styles.unavailableText]}>
              {displayPrice(item.currentValue)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>PURCHASE COST</Text>
            <Text style={styles.detailValue}>{formatCurrency(item.purchaseCost)}</Text>
          </View>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>PROFIT/LOSS</Text>
          <Text style={[styles.summaryValue, item.priceUnavailable ? styles.unavailableText : (isProfit ? styles.positiveText : styles.negativeText)]}>
            {displayPrice(item.profitLoss)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>% CHANGE</Text>
          <Text style={[styles.summaryValue, item.priceUnavailable ? styles.unavailableText : (isProfit ? styles.positiveText : styles.negativeText)]}>
            {displayPercentage(item.percentageChange)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  assetContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  assetTicker: {
    fontSize: 14,
    color: '#6c757d',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  dailyChangeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  positiveChange: {
    backgroundColor: '#d4edda',
  },
  negativeChange: {
    backgroundColor: '#f8d7da',
  },
  dailyChangeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  positiveText: {
    color: '#155724',
  },
  negativeText: {
    color: '#721c24',
  },
  detailsGrid: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailColumn: {
    flex: 1,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 11,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  summary: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  unavailableText: {
    color: '#6c757d',
    fontStyle: 'italic',
  },
});
