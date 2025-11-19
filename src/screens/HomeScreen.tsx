/**
 * HomeScreen Component
 * Main container component managing state, logic, and UI composition
 */

import { MaterialIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { BillInput } from '../components/BillInput';
import { PeopleCounter } from '../components/PeopleCounter';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { TipSelector } from '../components/TipSelector';
import { Colors } from '../constants/Colors';
import { calculateTip } from '../utils/Calculations';

export const HomeScreen: React.FC = () => {
  // State Management
  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [peopleCount, setPeopleCount] = useState<number>(1);

  // Memoized calculations
  const results = useMemo(() => {
    const bill = parseFloat(billAmount) || 0;
    return calculateTip(bill, tipPercentage, peopleCount);
  }, [billAmount, tipPercentage, peopleCount]);

  // People Counter Handlers
  const handleIncrementPeople = () => {
    setPeopleCount((prev) => Math.min(prev + 1, 20));
  };

  const handleDecrementPeople = () => {
    setPeopleCount((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setBillAmount('');
    setTipPercentage(15);
    setPeopleCount(1);
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Reset Button */}
          <View style={styles.headerTop}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Bill Splitter</Text>
              <Text style={styles.headerSubtitle}>Split bills fairly together</Text>
            </View>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.7}>
              <MaterialIcons name="refresh" size={28} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.contentContainer}>
            {/* Bill Input Section with Reset Button */}
            <View style={styles.billInputRow}>
              <View style={styles.billInputWrapper}>
                <BillInput
                  value={billAmount}
                  onChangeText={setBillAmount}
                  placeholder="100.00"
                />
              </View>
            </View>

            {/* Tip Percentage Selector Section */}
            <TipSelector
              tipPercentage={tipPercentage}
              onTipChange={setTipPercentage}
            />

            {/* People Counter Section */}
            <PeopleCounter
              count={peopleCount}
              onIncrement={handleIncrementPeople}
              onDecrement={handleDecrementPeople}
            />

            {/* Results Display Section */}
            <View style={styles.resultsSection}>
              <ResultsDisplay
                tipAmount={results.tipAmount}
                totalBill={results.totalBill}
                perPerson={results.perPerson}
              />
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 Adjust the bill amount, tip percentage, and number of people
                to see the split amount update in real-time.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
    textAlign: 'left',
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  billInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  billInputWrapper: {
    flex: 1,
  },
  resetButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  contentContainer: {
    flex: 1,
    gap: 4,
  },
  resultsSection: {
    width: '100%',
    marginTop: 20,
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: Colors.infoLight,
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
    marginTop: 16,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    lineHeight: 18,
  },
});

export default HomeScreen;
