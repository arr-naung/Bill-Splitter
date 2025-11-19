import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../constants/Colors';

interface SubscriptionModalProps {
    visible: boolean;
    onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ visible, onClose }) => {
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

    const handleSubscribe = () => {
        Alert.alert(
            'Welcome to Pro!',
            'Thank you for subscribing. You now have access to all premium features.',
            [{ text: 'Awesome!', onPress: onClose }]
        );
    };

    const handleRestore = () => {
        Alert.alert('Restore Purchases', 'No previous purchases found.');
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="workspace-premium" size={64} color="#FFD700" />
                        </View>

                        <Text style={styles.title}>Upgrade to Pro</Text>
                        <Text style={styles.subtitle}>Unlock the full potential of Bill Splitter</Text>

                        <View style={styles.benefitsContainer}>
                            <BenefitItem icon="block" text="Remove Ads" />
                            <BenefitItem icon="cloud-queue" text="Cloud Sync" />
                            <BenefitItem icon="palette" text="Custom Themes" />
                            <BenefitItem icon="insights" text="Advanced Stats" />
                        </View>

                        <View style={styles.plansContainer}>
                            <TouchableOpacity
                                style={[styles.planCard, selectedPlan === 'monthly' && styles.selectedPlan]}
                                onPress={() => setSelectedPlan('monthly')}
                                activeOpacity={0.8}
                            >
                                <View style={styles.radioButton}>
                                    {selectedPlan === 'monthly' && <View style={styles.radioButtonSelected} />}
                                </View>
                                <View style={styles.planInfo}>
                                    <Text style={styles.planName}>Monthly</Text>
                                    <Text style={styles.planPrice}>$4.99/mo</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.planCard, selectedPlan === 'yearly' && styles.selectedPlan]}
                                onPress={() => setSelectedPlan('yearly')}
                                activeOpacity={0.8}
                            >
                                <View style={styles.badgeContainer}>
                                    <Text style={styles.badgeText}>SAVE 20%</Text>
                                </View>
                                <View style={styles.radioButton}>
                                    {selectedPlan === 'yearly' && <View style={styles.radioButtonSelected} />}
                                </View>
                                <View style={styles.planInfo}>
                                    <Text style={styles.planName}>Yearly</Text>
                                    <Text style={styles.planPrice}>$49.99/yr</Text>
                                    <Text style={styles.planSubtext}>7 days free trial</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
                            <Text style={styles.subscribeButtonText}>
                                {selectedPlan === 'yearly' ? 'Start Free Trial' : 'Subscribe Now'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleRestore}>
                            <Text style={styles.restoreText}>Restore Purchases</Text>
                        </TouchableOpacity>

                        <Text style={styles.disclaimer}>
                            Recurring billing. Cancel anytime.
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const BenefitItem = ({ icon, text }: { icon: keyof typeof MaterialIcons.glyphMap; text: string }) => (
    <View style={styles.benefitItem}>
        <View style={styles.benefitIconContainer}>
            <MaterialIcons name={icon} size={20} color={Colors.primary} />
        </View>
        <Text style={styles.benefitText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '90%',
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
    },
    closeButton: {
        padding: 8,
        backgroundColor: Colors.gray100,
        borderRadius: 20,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        backgroundColor: '#FFF9C4', // Light yellow
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 32,
    },
    benefitsContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 12,
    },
    benefitItem: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray50,
        padding: 12,
        borderRadius: 12,
        gap: 12,
    },
    benefitIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    benefitText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    plansContainer: {
        width: '100%',
        gap: 16,
        marginBottom: 32,
    },
    planCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.gray200,
        backgroundColor: Colors.white,
    },
    selectedPlan: {
        borderColor: '#FFD700', // Gold
        backgroundColor: '#FFFDF5',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.gray300,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFD700',
    },
    planInfo: {
        flex: 1,
    },
    planName: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    planPrice: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    planSubtext: {
        fontSize: 12,
        color: Colors.success,
        fontWeight: '600',
        marginTop: 2,
    },
    badgeContainer: {
        position: 'absolute',
        top: -12,
        right: 20,
        backgroundColor: '#FFD700',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.black,
    },
    subscribeButton: {
        width: '100%',
        backgroundColor: Colors.black,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    subscribeButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '700',
    },
    restoreText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '600',
        marginBottom: 24,
    },
    disclaimer: {
        fontSize: 12,
        color: Colors.textTertiary,
        textAlign: 'center',
    },
});
