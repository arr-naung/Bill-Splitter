/**
 * HomeScreen Component
 * Main container component managing state, logic, and UI composition
 */

import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  Alert,
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
import { ItemizedBillModal } from '../components/ItemizedBillModal';
import { PeopleCounter } from '../components/PeopleCounter';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { TipSelector } from '../components/TipSelector';
import { Colors } from '../constants/Colors';
import { BillItem } from '../types';
import { calculateItemizedSplit, calculateTip } from '../utils/Calculations';

export const HomeScreen: React.FC = () => {
  // State Management
  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [peopleNames, setPeopleNames] = useState<Record<number, string>>({});

  // Itemized Mode State
  const [isItemizedMode, setIsItemizedMode] = useState(false);
  const [items, setItems] = useState<BillItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Memoized calculations
  const results = useMemo(() => {
    if (isItemizedMode) {
      return calculateItemizedSplit(items, tipPercentage, peopleCount);
    }
    const bill = parseFloat(billAmount) || 0;
    return calculateTip(bill, tipPercentage, peopleCount);
  }, [billAmount, tipPercentage, peopleCount, isItemizedMode, items]);

  // Update bill amount when items change in itemized mode
  React.useEffect(() => {
    if (isItemizedMode) {
      const total = items.reduce((sum, item) => sum + item.price, 0);
      setBillAmount(total.toFixed(2));
    }
  }, [items, isItemizedMode]);

  // People Counter Handlers
  const handleIncrementPeople = () => {
    setPeopleCount((prev) => Math.min(prev + 1, 20));
  };

  const handleDecrementPeople = () => {
    if (isItemizedMode) {
      const maxAssigned = items.reduce((max, item) => {
        const itemMax = Math.max(...item.assignedTo);
        return Math.max(max, itemMax);
      }, 0);

      if (peopleCount <= maxAssigned) {
        return;
      }
    }
    setPeopleCount((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to reset everything? This will clear all items and people.')) {
        setBillAmount('');
        setTipPercentage(15);
        setPeopleCount(1);
        setItems([]);
        setPeopleNames({});
      }
    } else {
      Alert.alert(
        'Reset All',
        'Are you sure you want to reset everything? This will clear all items and people.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: () => {
              setBillAmount('');
              setTipPercentage(15);
              setPeopleCount(1);
              setItems([]);
              setPeopleNames({});
            },
          },
        ]
      );
    }
  };

  const handleClearItems = () => {
    setItems([]);
  };

  const handleRenamePerson = (index: number, name: string) => {
    setPeopleNames((prev) => ({
      ...prev,
      [index]: name,
    }));
  };

  const handleAddItem = (name: string, price: number, assignedTo: number[]) => {
    const newItem: BillItem = {
      id: Date.now().toString(),
      name,
      price,
      assignedTo,
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleEditItem = (id: string, name: string, price: number, assignedTo: number[]) => {
    setItems(items.map((item) => (item.id === id ? { ...item, name, price, assignedTo } : item)));
  };

  const handleDeletePerson = (indexToDelete: number) => {
    if (peopleCount <= 1) return;

    // 1. Update People Count
    setPeopleCount((prev) => prev - 1);

    // 2. Update People Names (Shift keys down)
    const newNames: Record<number, string> = {};
    Object.keys(peopleNames).forEach((keyStr) => {
      const key = parseInt(keyStr);
      if (key < indexToDelete) {
        newNames[key] = peopleNames[key];
      } else if (key > indexToDelete) {
        newNames[key - 1] = peopleNames[key];
      }
    });
    setPeopleNames(newNames);

    // 3. Update Items Assignments
    const newItems = items.map((item) => {
      const newAssignedTo = item.assignedTo
        .filter((personIndex) => personIndex !== indexToDelete) // Remove deleted person
        .map((personIndex) => (personIndex > indexToDelete ? personIndex - 1 : personIndex)); // Shift indices

      return { ...item, assignedTo: newAssignedTo };
    });
    setItems(newItems);
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
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
            {/* Segmented Control for Mode Selection */}
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[styles.segment, !isItemizedMode && styles.segmentActive]}
                onPress={() => setIsItemizedMode(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.segmentText, !isItemizedMode && styles.segmentTextActive]}>
                  Simple
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segment, isItemizedMode && styles.segmentActive]}
                onPress={() => setIsItemizedMode(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.segmentText, isItemizedMode && styles.segmentTextActive]}>
                  Itemized
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input Card - Groups all inputs */}
            <View style={styles.inputCard}>
              <View style={styles.billInputRow}>
                <View style={styles.billInputWrapper}>
                  {isItemizedMode ? (
                    <TouchableOpacity
                      style={styles.editItemsButton}
                      onPress={() => setModalVisible(true)}
                    >
                      <Text style={styles.editItemsText}>
                        {items.length} Items (Tap to Edit)
                      </Text>
                      <Text style={styles.editItemsTotal}>${billAmount || '0.00'}</Text>
                    </TouchableOpacity>
                  ) : (
                    <BillInput
                      value={billAmount}
                      onChangeText={setBillAmount}
                      placeholder="100.00"
                    />
                  )}
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
            </View>

            {/* Results Display Section */}
            <View style={styles.resultsSection}>
              <ResultsDisplay
                billAmount={parseFloat(billAmount) || 0}
                tipAmount={results.tipAmount}
                totalBill={results.totalBill}
                perPerson={'perPerson' in results ? results.perPerson : 0}
                itemizedResults={'results' in results ? results.results : undefined}
                peopleNames={peopleNames}
              />
            </View>

            <ItemizedBillModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              items={items}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onClearItems={handleClearItems}
              peopleCount={peopleCount}
              onIncrementPeople={handleIncrementPeople}
              onDecrementPeople={handleDecrementPeople}
              onDeletePerson={handleDeletePerson}
              peopleNames={peopleNames}
              onRenamePerson={handleRenamePerson}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView >
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

  modeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  inputCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 16,
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.gray300,
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: Colors.primary,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.white,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  editItemsButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  editItemsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  editItemsTotal: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  billInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    gap: 20,
  },
  resultsSection: {
    width: '100%',
    marginTop: 24,
    marginBottom: 20,
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
