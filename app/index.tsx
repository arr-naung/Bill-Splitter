import { MaterialIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Color Palette - Tomato Red Based
const Colors = {
  // Primary Tomato Red
  primary: '#FF6347',
  primaryDark: '#E5533F',
  primaryLight: '#FF7F63',
  
  // Complementary Colors
  accent: '#4A90E2',
  accentLight: '#7BB3FF',
  success: '#48BB78',
  warning: '#EDB562',
  danger: '#DC3545',
  
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  lightGray: '#F7FAFC',
  mediumGray: '#EDF2F7',
  darkGray: '#4A5568',
  textPrimary: '#2D3748',
  textSecondary: '#718096',
  textTertiary: '#A0AEC0',
  
  // Background
  bgLight: '#FAFAFA',
};

// Calculation function
const calculateTip = (bill: number, percentage: number, people: number) => {
  if (bill < 0 || percentage < 0 || people < 1) {
    return {
      tipAmount: 0,
      totalBill: 0,
      perPerson: 0,
    };
  }

  let tipAmount = bill * (percentage / 100);
  let totalBill = bill + tipAmount;
  let perPerson = people > 0 ? totalBill / people : 0;

  // Round to nearest cent
  tipAmount = Math.round(tipAmount * 100) / 100;
  totalBill = Math.round(totalBill * 100) / 100;
  perPerson = Math.round(perPerson * 100) / 100;

  return { tipAmount, totalBill, perPerson };
};

const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(2)}`;
};

// Draggable Slider Component
const TipSlider = ({ value, onValueChange }: { value: number; onValueChange: (value: number) => void }) => {
  const sliderWidth = 280;
  const sliderPercentage = (value / 100) * 100;
  const thumbPosition = (sliderPercentage / 100) * sliderWidth;

  const handleSliderPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const percentage = Math.min(Math.max((locationX / sliderWidth) * 100, 0), 100);
    onValueChange(Math.round(percentage * 10) / 10);
  };

  return (
    <View style={sliderStyles.container}>
      <Text style={sliderStyles.percentageText}>{value.toFixed(1)}%</Text>
      <View
        style={[sliderStyles.sliderTrack, { width: sliderWidth }]}
        onStartShouldSetResponder={() => true}
        onResponderGrant={handleSliderPress}
        onResponderMove={handleSliderPress}
      >
        <View style={[sliderStyles.sliderFill, { width: `${sliderPercentage}%` }]} />
        <View style={[sliderStyles.sliderThumb, { left: thumbPosition - 12 }]} />
      </View>
      <View style={sliderStyles.chipsContainer}>
        {[0, 5, 10, 15, 20, 25, 30, 40].map((percent) => (
          <TouchableOpacity key={percent} style={[sliderStyles.chip, value === percent && sliderStyles.chipActive]} onPress={() => onValueChange(percent)}>
            <Text style={[sliderStyles.chipText, value === percent && sliderStyles.chipTextActive]}>{percent}%</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const sliderStyles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 12 },
  sliderTrack: { height: 10, backgroundColor: Colors.mediumGray, borderRadius: 5, overflow: 'visible', marginBottom: 12, justifyContent: 'center', position: 'relative' },
  sliderFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 5 },
  sliderThumb: { position: 'absolute', width: 28, height: 28, borderRadius: 18, backgroundColor: Colors.primary, borderWidth: 2, borderColor: Colors.primary, top: -10, shadowColor: Colors.darkGray, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 6 },
  percentageText: { fontSize: 18, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  chipsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 4, width: 280 },
  chip: { paddingHorizontal: 6, paddingVertical: 6, borderRadius: 8, backgroundColor: Colors.lightGray, borderWidth: 1.5, borderColor: Colors.mediumGray, alignItems: 'center', flex: 1 },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
  chipTextActive: { color: Colors.white },
});

const BillInput = ({ value, onChangeText, isValid = true }: { value: string; onChangeText: (text: string) => void; isValid?: boolean }) => (
  <View>
    <Text style={styles.sectionLabel}>Bill Amount</Text>
    <View style={[styles.billInputContainer, !isValid && { borderColor: Colors.danger }]}>
      <Text style={styles.currencySymbol}>$</Text>
      <TextInput style={styles.billInput} placeholder="0.00" placeholderTextColor={Colors.textTertiary} keyboardType="decimal-pad" value={value} onChangeText={onChangeText} />
    </View>
    {!isValid && <Text style={styles.errorMessage}>Please enter a valid amount</Text>}
  </View>
);

const PeopleCounter = ({ count, onCountChange }: { count: number; onCountChange: (count: number) => void }) => (
  <View>
    <Text style={styles.sectionLabel}>Number of People</Text>
    <View style={styles.counterContainer}>
      <TouchableOpacity style={[styles.counterButton, styles.minusButton]} onPress={() => count > 1 && onCountChange(count - 1)} disabled={count <= 1}>
        <Text style={styles.counterButtonText}>−</Text>
      </TouchableOpacity>
      <View style={styles.countDisplay}><Text style={styles.countText}>{count}</Text></View>
      <TouchableOpacity style={[styles.counterButton, styles.plusButton]} onPress={() => onCountChange(count + 1)}>
        <Text style={styles.counterButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ResultsDisplay = ({ tipAmount, totalBill, perPerson, tipPercentage }: { tipAmount: number; totalBill: number; perPerson: number; tipPercentage: number }) => (
  <View style={styles.resultsContainer}>
    <View style={styles.summaryRow}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Tip Amount({tipPercentage.toFixed(1)}%)</Text>
        <Text style={styles.summaryValue}>{formatCurrency(tipAmount)}</Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Total Bill</Text>
        <Text style={styles.summaryValue}>{formatCurrency(totalBill)}</Text>
      </View>
    </View>
    <View style={styles.separator} />
    <View style={styles.perPersonSection}>
      <Text style={styles.perPersonLabel}>Per Person</Text>
      <Text style={styles.perPersonValue}>{formatCurrency(perPerson)}</Text>
    </View>
  </View>
);

export default function HomeScreen() {
  const [bill, setBill] = useState('');
  const [tipPercentage, setTipPercentage] = useState(15);
  const [customTipInput, setCustomTipInput] = useState('15');
  const [isCustomTipInputValid, setIsCustomTipInputValid] = useState(true);
  const [peopleCount, setPeopleCount] = useState(2);
  const [isBillAmountValid, setIsBillAmountValid] = useState(true);

  const billAmount = parseFloat(bill) || 0;
  
  const results = useMemo(() => {
    return calculateTip(billAmount, tipPercentage, peopleCount);
  }, [billAmount, tipPercentage, peopleCount]);

  const validateBillInput = (text: string) => {
    if (text === '') {
      setIsBillAmountValid(true);
      setBill(text);
      return;
    }
    // Allow only numbers and single decimal point
    const decimalCount = (text.match(/\./g) || []).length;
    if (/^\d*\.?\d*$/.test(text) && decimalCount <= 1) {
      setIsBillAmountValid(true);
      setBill(text);
    } else {
      setIsBillAmountValid(false);
    }
  };

  const handleTipChange = (value: number) => {
    setTipPercentage(value);
    setCustomTipInput(String(Math.round(value)));
    setIsCustomTipInputValid(true);
  };

  const handleCustomTipInputChange = (text: string) => {
    if (text === '') {
      setCustomTipInput(text);
      setIsCustomTipInputValid(true);
      return;
    }
    
    // Allow only numbers and single decimal point
    const decimalCount = (text.match(/\./g) || []).length;
    if (/^\d*\.?\d*$/.test(text) && decimalCount <= 1) {
      setCustomTipInput(text);
      const numValue = parseFloat(text);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
        setTipPercentage(numValue);
        setIsCustomTipInputValid(true);
      } else if (text !== '.') {
        setIsCustomTipInputValid(numValue <= 100 && numValue >= 0);
      }
    } else {
      setIsCustomTipInputValid(false);
    }
  };

  const resetAll = () => {
    setBill('');
    setTipPercentage(15);
    setCustomTipInput('15');
    setPeopleCount(2);
    setIsBillAmountValid(true);
    setIsCustomTipInputValid(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Tip Splitter</Text>
          <Text style={styles.headerSubtitle}>Calculate and split bills</Text>
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={resetAll}>
          <MaterialIcons name="refresh" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContent}>
          <View style={styles.card}>
            <BillInput value={bill} onChangeText={validateBillInput} isValid={isBillAmountValid} />
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Tip Percentage</Text>
            <TipSlider value={tipPercentage} onValueChange={handleTipChange} />
            <View style={styles.customTipRow}>
              <Text style={styles.customTipLabel}>Or enter custom tip %</Text>
              <View style={[styles.customTipInputContainer, !isCustomTipInputValid && { borderColor: Colors.danger }]}>
                <TextInput
                  style={styles.customTipInput}
                  placeholder="0"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="decimal-pad"
                  value={customTipInput}
                  onChangeText={handleCustomTipInputChange}
                />
              </View>
            </View>
            {!isCustomTipInputValid && <Text style={styles.errorMessage}>Please enter a valid percentage (0-100)</Text>}
          </View>
          <View style={styles.card}>
            <PeopleCounter count={peopleCount} onCountChange={setPeopleCount} />
          </View>
          <ResultsDisplay tipAmount={results.tipAmount} totalBill={results.totalBill} perPerson={results.perPerson} tipPercentage={tipPercentage} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E8ECED' },
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.mediumGray },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', marginVertical: 12, gap: 12 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: Colors.primary },
  headerSubtitle: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  resetButton: { padding: 8, justifyContent: 'center', alignItems: 'center' },
  mainContent: { gap: 14 },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 18, borderWidth: 0, ...Platform.select({ ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }) },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12, letterSpacing: 0.4 },
  billInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: Colors.mediumGray, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.lightGray },
  currencySymbol: { fontSize: 18, fontWeight: '700', color: Colors.primary, marginRight: 10 },
  billInput: { flex: 1, fontSize: 24, fontWeight: '600', color: Colors.textPrimary, padding: 0 },
  errorMessage: { color: Colors.danger, fontSize: 12, marginTop: 6, fontWeight: '500' },
  counterContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  counterButton: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  minusButton: { backgroundColor: Colors.darkGray },
  plusButton: { backgroundColor: Colors.darkGray },
  counterButtonText: { fontSize: 28, fontWeight: '700', color: Colors.white },
  countDisplay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  countText: { fontSize: 42, fontWeight: '700', color: Colors.black },
  resultsContainer: { backgroundColor: Colors.primary, borderRadius: 16, padding: 20, borderWidth: 0, ...Platform.select({ ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12 }, android: { elevation: 5 } }) },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.8)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.3 },
  summaryValue: { fontSize: 20, fontWeight: '800', color: Colors.white },
  summaryDivider: { width: 1, height: 50, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 12 },
  separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 16 },
  perPersonSection: { alignItems: 'center', paddingVertical: 12 },
  perPersonLabel: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.8)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 },
  perPersonValue: { fontSize: 48, fontWeight: '800', color: Colors.white },
  customTipRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 6, width: '100%' },
  customTipLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, flexShrink: 1, maxWidth: '55%' },
  customTipInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: Colors.mediumGray, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: Colors.lightGray, flex: 1, minWidth: 80 },
  customTipInput: { flex: 1, fontSize: 16, fontWeight: '600', color: Colors.textPrimary, padding: 0 },
  roundingContainer: { marginTop: 16, flexDirection: 'row', gap: 12 },
  roundingToggle: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, backgroundColor: Colors.lightGray, borderWidth: 1.5, borderColor: Colors.mediumGray },
  roundingToggleActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  roundingToggleText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  roundingToggleTextActive: { color: Colors.white },
  roundingCheckmark: { fontSize: 18, fontWeight: '700', color: Colors.white },
});
