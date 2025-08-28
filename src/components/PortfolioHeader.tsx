import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useComputedCryptoAssets } from '../store';

export const PortfolioHeader: React.FC = () => {
  const cryptoAssets = useComputedCryptoAssets();

  // Calculate portfolio totals
  const totals = cryptoAssets.reduce(
    (acc, asset) => {
      if (!asset.priceUnavailable) {
        acc.totalValue += asset.currentValue;
        acc.totalProfitLoss += asset.profitLoss;
      }
      acc.totalCost += asset.purchaseCost;
      return acc;
    },
    { totalValue: 0, totalCost: 0, totalProfitLoss: 0 }
  );

  const totalPercentageChange = totals.totalCost > 0
    ? (totals.totalProfitLoss / totals.totalCost) * 100
    : 0;

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
    return `${sign}${percentage.toFixed(2)}%`;
  };

  const isPositive = totals.totalProfitLoss >= 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Crypto Portfolio</Text>

      <View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Value:</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totals.totalValue)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Cost:</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totals.totalCost)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, styles.profitLossLabel]}>Total P&L:</Text>
          <Text style={[styles.summaryValue, isPositive ? styles.positiveText : styles.negativeText]}>
            {formatCurrency(totals.totalProfitLoss)} ({formatPercentage(totalPercentageChange)})
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  profitLossLabel: {
    color: '#28a745',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '600',
  },
  positiveText: {
    color: '#28a745',
  },
  negativeText: {
    color: '#dc3545',
  },
});
