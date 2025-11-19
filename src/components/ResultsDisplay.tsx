/**
 * ResultsDisplay Component
 * Renders calculated tip, total bill, and per-person amount
 */

import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { PersonResult } from '../types';
import { formatCurrency } from '../utils/Calculations';

interface ResultsDisplayProps {
  billAmount: number;
  tipAmount: number;
  totalBill: number;
  perPerson?: number;
  itemizedResults?: PersonResult[];
  peopleNames?: Record<number, string>;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  billAmount,
  tipAmount,
  totalBill,
  perPerson = 0,
  itemizedResults,
  peopleNames = {},
}) => {
  const handleShare = async () => {
    try {
      let message = `🧾 Bill Splitter Results\n\n`;
      message += `💵 Bill: ${formatCurrency(billAmount)}\n`;
      message += `✨ Tip: ${formatCurrency(tipAmount)}\n`;
      message += `💰 Total: ${formatCurrency(totalBill)}\n\n`;

      if (itemizedResults && itemizedResults.length > 0) {
        message += `📋 Breakdown:\n`;
        itemizedResults.forEach((person) => {
          const name = peopleNames[person.personIndex] || `Person ${person.personIndex}`;
          message += `${name}: ${formatCurrency(person.totalAmount)}\n`;
        });
      } else {
        message += `👤 Per Person: ${formatCurrency(perPerson)}`;
      }

      await Share.share({
        message,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.mainResultCard}>
      {/* Header with Share Button */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Results</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Share</Text>
          <MaterialIcons name="share" size={16} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Header Divider */}
      <View style={styles.headerDivider} />

      {/* Top Section: Bill, Tip, and Total */}
      <View style={styles.topSection}>
        <View style={styles.topRow}>
          <View style={styles.topItem}>
            <Text style={styles.secondaryLabel}>Bill</Text>
            <Text style={styles.secondaryAmount}>
              {formatCurrency(billAmount)}
            </Text>
          </View>
          <View style={styles.topDivider} />
          <View style={styles.topItem}>
            <Text style={styles.secondaryLabel}>Tip</Text>
            <Text style={styles.secondaryAmount}>
              {formatCurrency(tipAmount)}
            </Text>
          </View>
          <View style={styles.topDivider} />
          <View style={styles.topItem}>
            <Text style={styles.secondaryLabel}>Total</Text>
            <Text style={styles.secondaryAmount}>
              {formatCurrency(totalBill)}
            </Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom Section: Per Person - Main Result */}
      {itemizedResults && itemizedResults.length > 0 ? (
        <View style={styles.itemizedList}>
          <Text style={styles.itemizedTitle}>Breakdown</Text>
          {itemizedResults.map((person) => (
            <View key={person.personIndex} style={styles.itemizedRow}>
              <Text style={styles.itemizedLabel}>
                {peopleNames[person.personIndex] || `Person ${person.personIndex}`}
              </Text>
              <Text style={styles.itemizedAmount}>
                {formatCurrency(person.totalAmount)}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.bottomSection}>
          <Text style={styles.mainLabel}>Per Person</Text>
          <Text style={styles.mainAmount}>{formatCurrency(perPerson)}</Text>
        </View>
      )}
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 16,
  },
  topItem: {
    flex: 1,
    alignItems: 'center',
  },
  topDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  itemizedList: {
    padding: 20,
  },
  itemizedTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  itemizedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemizedLabel: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  itemizedAmount: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
  },
  shareButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  headerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 20,
    marginBottom: 16,
  },
});
