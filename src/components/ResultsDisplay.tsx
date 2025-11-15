/**
 * ResultsDisplay Component
 * Renders calculated tip, total bill, and per-person amount
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface ResultsDisplayProps {
  tipAmount: number;
  totalBill: number;
  perPerson: number;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  tipAmount,
  totalBill,
  perPerson,
}) => {
  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <View style={styles.mainResultCard}>
      {/* Top Section: Per Person - Main Result */}
      <View style={styles.topSection}>
        <Text style={styles.mainLabel}>Per Person</Text>
        <Text style={styles.mainAmount}>{formatCurrency(perPerson)}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom Section: Tip and Total (Stacked) */}
      <View style={styles.bottomSection}>
        <View style={styles.bottomRow}>
          <View style={styles.bottomItem}>
            <Text style={styles.secondaryLabel}>Tip Amount</Text>
            <Text style={styles.secondaryAmount}>
              {formatCurrency(tipAmount)}
            </Text>
          </View>
          <View style={styles.bottomDivider} />
          <View style={styles.bottomItem}>
            <Text style={styles.secondaryLabel}>Total Bill</Text>
            <Text style={styles.secondaryAmount}>
              {formatCurrency(totalBill)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainResultCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  topSection: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
    opacity: 0.9,
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  mainAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  bottomSection: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 16,
  },
  bottomItem: {
    flex: 1,
    alignItems: 'center',
  },
  bottomDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
    opacity: 0.85,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  secondaryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
});

