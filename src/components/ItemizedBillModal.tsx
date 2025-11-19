import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../constants/Colors';
import { BillItem } from '../types';
import { formatCurrency } from '../utils/Calculations';


interface ItemizedBillModalProps {
    visible: boolean;
    onClose: () => void;
    items: BillItem[];
    onAddItem: (name: string, price: number, assignedTo: number[]) => void;
    onEditItem: (id: string, name: string, price: number, assignedTo: number[]) => void;
    onDeleteItem: (id: string) => void;
    onClearItems: () => void;
    peopleCount: number;
    onIncrementPeople: () => void;
    onDecrementPeople: () => void;
    onDeletePerson: (index: number) => void;
    peopleNames: Record<number, string>;
    onRenamePerson: (index: number, name: string) => void;
}

export const ItemizedBillModal: React.FC<ItemizedBillModalProps> = ({
    visible,
    onClose,
    items,
    onAddItem,
    onEditItem,
    onDeleteItem,
    onClearItems,
    peopleCount,
    onIncrementPeople,
    onDecrementPeople,
    onDeletePerson,
    peopleNames,
    onRenamePerson,
}) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [selectedPeople, setSelectedPeople] = useState<number[]>([]);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    // Rename Modal State
    const [renameModalVisible, setRenameModalVisible] = useState(false);
    const [personToRename, setPersonToRename] = useState<number | null>(null);
    const [tempName, setTempName] = useState('');
    const [manageNamesVisible, setManageNamesVisible] = useState(false);

    const handleOpenRename = (index: number) => {
        setPersonToRename(index);
        setTempName(peopleNames[index] || `Person ${index}`);
        setRenameModalVisible(true);
    };

    const handleSaveName = () => {
        if (personToRename !== null && tempName.trim()) {
            onRenamePerson(personToRename, tempName.trim());
            setRenameModalVisible(false);
        }
    };

    const handleAddItem = () => {
        if (!newItemName || !newItemPrice || selectedPeople.length === 0) return;
        const price = parseFloat(newItemPrice);
        if (isNaN(price) || price <= 0) return;

        if (editingItemId) {
            onEditItem(editingItemId, newItemName, price, selectedPeople);
            setEditingItemId(null);
        } else {
            onAddItem(newItemName, price, selectedPeople);
        }
        setNewItemName('');
        setNewItemPrice('');
        setSelectedPeople([]);
    };

    const handleStartEdit = (item: BillItem) => {
        setNewItemName(item.name);
        setNewItemPrice(item.price.toString());
        setSelectedPeople(item.assignedTo);
        setEditingItemId(item.id);
    };

    const handleCancelEdit = () => {
        setNewItemName('');
        setNewItemPrice('');
        setSelectedPeople([]);
        setEditingItemId(null);
    };

    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    const togglePersonSelection = (index: number) => {
        if (selectedPeople.includes(index)) {
            setSelectedPeople(selectedPeople.filter((i) => i !== index));
        } else {
            setSelectedPeople([...selectedPeople, index]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedPeople.length === peopleCount) {
            setSelectedPeople([]);
        } else {
            setSelectedPeople(Array.from({ length: peopleCount }, (_, i) => i + 1));
        }
    };

    return (
        <>
            <Modal visible={visible} animationType="slide" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Items</Text>
                            <View style={styles.headerRight}>
                                <View style={styles.headerButtons}>
                                    {items.length > 0 && (
                                        <TouchableOpacity onPress={() => {
                                            if (Platform.OS === 'web') {
                                                if (window.confirm('Are you sure you want to clear all items? This cannot be undone.')) {
                                                    onClearItems();
                                                }
                                            } else {
                                                Alert.alert(
                                                    'Clear All Items',
                                                    'Are you sure you want to clear all items? This cannot be undone.',
                                                    [
                                                        { text: 'Cancel', style: 'cancel' },
                                                        { text: 'Clear', style: 'destructive', onPress: onClearItems },
                                                    ]
                                                );
                                            }
                                        }} style={styles.clearButton}>
                                            <MaterialIcons name="refresh" size={24} color={Colors.primary} />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={onClose} style={styles.doneButton}>
                                        <Text style={styles.doneButtonText}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.modalSubtitle}>Total: {formatCurrency(totalAmount)}</Text>
                            </View>
                        </View>

                        <ScrollView
                            style={styles.itemsList}
                            contentContainerStyle={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            {items.length === 0 ? (
                                <Text style={styles.emptyText}>No items added yet.</Text>
                            ) : (
                                items.map((item) => (
                                    <View key={item.id} style={styles.itemRow}>
                                        <View style={styles.itemInfo}>
                                            <Text style={styles.itemName}>{item.name}</Text>
                                            <Text style={styles.itemAssigned}>
                                                Assigned to: {item.assignedTo.map(i => peopleNames[i] || `Person ${i}`).join(', ')}
                                            </Text>
                                        </View>
                                        <View style={styles.itemRight}>
                                            <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
                                            <TouchableOpacity onPress={() => handleStartEdit(item)}>
                                                <MaterialIcons name="edit" size={24} color={Colors.primary} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => onDeleteItem(item.id)}>
                                                <MaterialIcons name="delete-outline" size={24} color={Colors.danger} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            )}

                            {/* Add Item Section - Now inside ScrollView */}
                            <View style={styles.addItemSection}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>{editingItemId ? 'Edit Item' : 'Add New Item'}</Text>
                                    {editingItemId && (
                                        <TouchableOpacity onPress={handleCancelEdit}>
                                            <Text style={styles.cancelEditText}>Cancel</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <View style={styles.inputRow}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Item Name (e.g. Pizza)"
                                        value={newItemName}
                                        onChangeText={setNewItemName}
                                        placeholderTextColor="#999"
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Price"
                                        value={newItemPrice}
                                        onChangeText={setNewItemPrice}
                                        keyboardType="decimal-pad"
                                        placeholderTextColor="#999"
                                    />
                                </View>

                                <View style={styles.assignHeader}>
                                    <View style={styles.assignLabelContainer}>
                                        <Text style={styles.assignLabel}>Assign to:</Text>
                                        <TouchableOpacity onPress={toggleSelectAll}>
                                            <Text style={styles.selectAllLink}>
                                                {selectedPeople.length === peopleCount ? 'Deselect All' : 'Select All'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={() => setManageNamesVisible(true)}>
                                        <Text style={styles.editNamesLink}>Manage People</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.peopleSelectionRow}>
                                    <View style={styles.peopleSelectorWrapper}>
                                        <View style={styles.peopleSelectorContainer}>
                                            {Array.from({ length: peopleCount }, (_, i) => i + 1).map((personIndex) => (
                                                <TouchableOpacity
                                                    key={personIndex}
                                                    style={[
                                                        styles.personChip,
                                                        selectedPeople.includes(personIndex) && styles.personChipSelected,
                                                    ]}
                                                    onPress={() => togglePersonSelection(personIndex)}
                                                    onLongPress={() => handleOpenRename(personIndex)}
                                                    delayLongPress={500}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.personChipText,
                                                            selectedPeople.includes(personIndex) && styles.personChipTextSelected,
                                                        ]}
                                                    >
                                                        {peopleNames[personIndex] || `P${personIndex}`}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                    <View style={styles.personControlButtons}>
                                        <TouchableOpacity
                                            style={styles.personActionButton}
                                            onPress={onIncrementPeople}
                                        >
                                            <MaterialIcons name="person-add" size={20} color={Colors.primary} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.addButton,
                                        (!newItemName || !newItemPrice || selectedPeople.length === 0) && styles.addButtonDisabled,
                                        editingItemId ? styles.updateButton : null,
                                    ]}
                                    onPress={handleAddItem}
                                    disabled={!newItemName || !newItemPrice || selectedPeople.length === 0}
                                >
                                    <Text style={styles.addButtonText}>{editingItemId ? 'Update Item' : 'Add Item'}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Rename Modal */}
            <Modal visible={renameModalVisible} transparent animationType="fade">
                <View style={styles.renameModalOverlay}>
                    <View style={styles.renameModalContent}>
                        <Text style={styles.renameTitle}>Rename Person</Text>
                        <TextInput
                            style={styles.renameInput}
                            value={tempName}
                            onChangeText={setTempName}
                            placeholder="Enter name"
                            autoFocus
                        />
                        <View style={styles.renameButtons}>
                            <TouchableOpacity
                                style={[styles.renameButton, styles.cancelButton]}
                                onPress={() => setRenameModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.renameButton, styles.saveButton]}
                                onPress={handleSaveName}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Manage Names Modal */}
            <Modal visible={manageNamesVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Manage People</Text>
                            <TouchableOpacity onPress={() => setManageNamesVisible(false)} style={styles.doneButton}>
                                <Text style={styles.doneButtonText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.itemsList}>
                            {Array.from({ length: peopleCount }, (_, i) => i + 1).map((personIndex) => (
                                <View key={personIndex} style={styles.nameEditRow}>
                                    <View style={styles.nameEditInputContainer}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.nameEditLabel}>Person {personIndex}</Text>
                                            <TextInput
                                                style={styles.nameEditInput}
                                                value={peopleNames[personIndex] || ''}
                                                onChangeText={(text) => onRenamePerson(personIndex, text)}
                                                placeholder={`Name for Person ${personIndex}`}
                                                placeholderTextColor="#ccc"
                                            />
                                        </View>
                                        {peopleCount > 1 && (
                                            <TouchableOpacity
                                                onPress={() => onDeletePerson(personIndex)}
                                                style={styles.deletePersonButton}
                                            >
                                                <MaterialIcons name="delete-outline" size={24} color={Colors.danger} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

        </>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '80%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    modalSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.success,
    },
    doneButton: {
        padding: 8,
    },
    doneButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerRight: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 4,
    },
    clearButton: {
        padding: 8,
    },
    itemsList: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
        flexGrow: 1,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.textSecondary,
        marginTop: 40,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray200,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    itemAssigned: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary,
    },
    addItemSection: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.gray200,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cancelEditText: {
        color: Colors.danger,
        fontSize: 14,
        fontWeight: '600',
    },
    inputRow: {
        flexDirection: 'column',
        gap: 12,
        marginBottom: 12,
    },
    input: {
        width: '100%',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.gray300,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    assignLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.textSecondary,
    },
    assignLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    selectAllLink: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    assignHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    editNamesLink: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    peopleSelectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    peopleSelectorWrapper: {
        flex: 1,
    },
    peopleSelectorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    personChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.gray300,
        // Remove marginRight as we use gap in container
    },
    personChipSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    personChipText: {
        fontSize: 14,
        color: Colors.textPrimary,
    },
    personChipTextSelected: {
        color: Colors.white,
    },
    addButton: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    updateButton: {
        backgroundColor: Colors.accent,
    },
    addButtonDisabled: {
        backgroundColor: Colors.gray300,
    },
    addButtonText: {
        color: Colors.white,
        fontWeight: '600',
        fontSize: 16,
    },
    personControlButtons: {
        flexDirection: 'row',
        gap: 8,
        marginLeft: 8,
    },
    personActionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.gray300,
        alignItems: 'center',
        justifyContent: 'center',
    },

    renameModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    renameModalContent: {
        backgroundColor: Colors.background,
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 320,
    },
    renameTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    renameInput: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.gray300,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    renameButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    renameButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.gray200,
    },
    saveButton: {
        backgroundColor: Colors.primary,
    },
    cancelButtonText: {
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    saveButtonText: {
        color: Colors.white,
        fontWeight: '600',
    },
    nameEditRow: {
        marginBottom: 16,
    },
    nameEditLabel: {
        fontSize: 14,
        color: Colors.textPrimary,
        fontWeight: '600',
        marginBottom: 4,
    },
    nameEditInput: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.gray300,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    nameEditInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    deletePersonButton: {
        padding: 8,
        marginTop: 20, // Align with input
    },
});
