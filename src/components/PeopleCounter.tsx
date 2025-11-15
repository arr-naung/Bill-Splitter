/**
 * PeopleCounter Component
 * Renders split count with increment/decrement buttons
 */

import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface PeopleCounterProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  minPeople?: number;
  maxPeople?: number;
}

export const PeopleCounter: React.FC<PeopleCounterProps> = ({
  count,
  onIncrement,
  onDecrement,
  minPeople = 1,
  maxPeople = 20,
}) => {
  const isDecrementDisabled = count <= minPeople;
  const isIncrementDisabled = count >= maxPeople;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Number of People</Text>
      <View style={styles.counterWrapper}>
        <TouchableOpacity
          style={[
            styles.button,
            isDecrementDisabled && styles.buttonDisabled,
          ]}
          onPress={onDecrement}
          disabled={isDecrementDisabled}
          activeOpacity={0.7}
          accessibilityLabel="Decrease number of people"
          accessibilityRole="button"
          accessibilityHint={`Current: ${count} people. Decrease button${
            isDecrementDisabled ? ' disabled' : ''
          }`}
        >
          <MaterialIcons
            name="remove"
            size={24}
            color={isDecrementDisabled ? Colors.gray400 : Colors.white}
          />
        </TouchableOpacity>

        <View style={styles.countDisplay}>
          <Text style={styles.countText}>{count}</Text>
          <Text style={styles.countLabel}>
            {count === 1 ? 'person' : 'people'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            isIncrementDisabled && styles.buttonDisabled,
          ]}
          onPress={onIncrement}
          disabled={isIncrementDisabled}
          activeOpacity={0.7}
          accessibilityLabel="Increase number of people"
          accessibilityRole="button"
          accessibilityHint={`Current: ${count} people. Increase button${
            isIncrementDisabled ? ' disabled' : ''
          }`}
        >
          <MaterialIcons
            name="add"
            size={24}
            color={isIncrementDisabled ? Colors.gray400 : Colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  counterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    height: 60,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: Colors.gray300,
    shadowOpacity: 0,
    elevation: 0,
  },
  countDisplay: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  countText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
  },
  countLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
});

export default PeopleCounter;
