/**
 * HomeScreen Component
 * Main container component managing state, logic, and UI composition
 */

import { MaterialIcons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BillInput } from '../components/BillInput';
import { PeopleCounter } from '../components/PeopleCounter';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { Colors } from '../constants/Colors';
import { calculateTip } from '../utils/Calculations';

export const HomeScreen: React.FC = () => {
  // State Management
  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [sliderWidth, setSliderWidth] = useState<number>(0);
  const [sliderLeft, setSliderLeft] = useState<number>(0);
  const sliderTrackRef = useRef<any>(null);

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

  const handleSliderChange = (e: any) => {
    // Use pageX and measured track left to calculate precise relative X
    const pageX = e.nativeEvent.pageX;
    const width = sliderWidth > 0 ? sliderWidth : 280; // fallback width

    if (typeof pageX === 'number' && typeof sliderLeft === 'number') {
      const relativeX = pageX - sliderLeft;
      const clamped = Math.max(0, Math.min(relativeX, width));
      const percentage = Math.min(Math.max(Math.round((clamped / width) * 100), 0), 100);
      setTipPercentage(percentage);
      return;
    }

    // Fallback to locationX if pageX or sliderLeft unavailable
    const locationX = e.nativeEvent.locationX;
    if (typeof locationX === 'number' && width > 0) {
      const percentage = Math.min(Math.max(Math.round((locationX / width) * 100), 0), 100);
      setTipPercentage(percentage);
    }
  };

  const handleTrackLayout = (e: any) => {
    const { width, x } = e.nativeEvent.layout;
    setSliderWidth(width);
    // Try to get absolute X on screen for pageX calculations
    if (sliderTrackRef.current && sliderTrackRef.current.measureInWindow) {
      try {
        sliderTrackRef.current.measureInWindow((absX: number, _y: number, _w: number, _h: number) => {
          setSliderLeft(absX);
        });
      } catch {
        setSliderLeft(x || 0);
      }
    } else {
      setSliderLeft(x || 0);
    }
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

            {/* Tip Percentage Slider Section */}
            <View style={styles.sliderSection}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>Tip Percentage (%)</Text>
                <View style={styles.customTipInputContainer}>
                  <TextInput
                    style={styles.customTipInput}
                    placeholder="Enter custom tip"
                    placeholderTextColor={Colors.textTertiary}
                    keyboardType="decimal-pad"
                    value={String(tipPercentage)}
                    onChangeText={(text: string) => {
                      const num = parseFloat(text) || 0;
                      setTipPercentage(Math.min(Math.max(num, 0), 100));
                    }}
                    maxLength={3}
                  />
                </View>
              </View>

              <View style={styles.sliderContainer}>
                <View
                  ref={sliderTrackRef}
                  style={styles.sliderTrack}
                  onLayout={handleTrackLayout}
                  onStartShouldSetResponder={() => true}
                  onResponderGrant={handleSliderChange}
                  onResponderMove={handleSliderChange}
                  onResponderRelease={() => {}}
                >
                  <View
                    style={[
                      styles.sliderFill,
                      { width: `${(tipPercentage / 100) * 100}%` },
                    ]}
                  />
                  <View
                    style={[
                      styles.sliderThumb,
                      { left: `${(tipPercentage / 100) * 100}%` },
                    ]}
                  />
                </View>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabelText}>0%</Text>
                  <Text style={styles.sliderPercentageDisplay}>{tipPercentage}%</Text>
                  <Text style={styles.sliderLabelText}>100%</Text>
                </View>
              </View>

              {/* Quick Preset Tips - 8 Options */}
              <View style={styles.quickTipsContainer}>
                {[0, 5, 10, 15, 20, 25, 30, 40].map((percentage) => (
                  <TouchableOpacity
                    key={percentage}
                    style={[
                      styles.quickTipButton,
                      tipPercentage === percentage &&
                        styles.quickTipButtonActive,
                    ]}
                    onPress={() => setTipPercentage(percentage)}
                  >
                    <Text
                      style={[
                        styles.quickTipButtonText,
                        tipPercentage === percentage &&
                          styles.quickTipButtonTextActive,
                      ]}
                    >
                      {percentage}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

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
  sliderSection: {
    width: '100%',
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  sliderContainer: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  sliderTrack: {
    height: 14,
    backgroundColor: Colors.gray300,
    borderRadius: 7,
    overflow: 'visible',
    marginBottom: 8,
    justifyContent: 'center',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  sliderThumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.white,
    top: -7,
    marginLeft: -14,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 10,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sliderPercentageDisplay: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  quickTipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quickTipButton: {
    width: '23%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.gray300,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickTipButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickTipButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  quickTipButtonTextActive: {
    color: Colors.white,
  },
  customTipInputContainer: {
    flex: 0.35,
    borderWidth: 1.5,
    borderColor: Colors.gray300,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    minHeight: 40,
  },
  customTipInput: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    paddingVertical: 2,
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
