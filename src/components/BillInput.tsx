/**
 * BillInput Component
 * Handles bill amount input with currency formatting and visual feedback
 */

import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface BillInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const BillInput: React.FC<BillInputProps> = ({
  value,
  onChangeText,
  placeholder = '0.00',
}) => {
  const handleChangeText = (text: string) => {
    // Remove non-numeric characters except decimal point
    const numericText = text.replace(/[^0-9.]/g, '');

    // Prevent multiple decimal points
    const parts = numericText.split('.');
    if (parts.length > 2) {
      return;
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    onChangeText(numericText);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bill Amount</Text>
      <View style={styles.inputWrapper}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textTertiary}
          keyboardType="decimal-pad"
          value={value}
          onChangeText={handleChangeText}
          maxLength={10}
          accessibilityLabel="Bill amount input"
          accessibilityHint="Enter the bill amount in dollars"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.gray200,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    padding: 0,
  },
});

export default BillInput;
