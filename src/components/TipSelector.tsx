/**
 * TipSelector Component
 * Handles tip percentage selection via slider, presets, and custom input
 */

import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/Colors';

interface TipSelectorProps {
    tipPercentage: number;
    onTipChange: (percentage: number) => void;
}

export const TipSelector: React.FC<TipSelectorProps> = ({
    tipPercentage,
    onTipChange,
}) => {
    const [sliderWidth, setSliderWidth] = useState<number>(0);
    const [sliderLeft, setSliderLeft] = useState<number>(0);
    const sliderTrackRef = useRef<any>(null);

    const handleSliderChange = (e: any) => {
        // Use pageX and measured track left to calculate precise relative X
        const pageX = e.nativeEvent.pageX;
        const width = sliderWidth > 0 ? sliderWidth : 280; // fallback width

        if (typeof pageX === 'number' && typeof sliderLeft === 'number') {
            const relativeX = pageX - sliderLeft;
            const clamped = Math.max(0, Math.min(relativeX, width));
            const percentage = Math.min(
                Math.max(Math.round((clamped / width) * 100), 0),
                100
            );
            onTipChange(percentage);
            return;
        }

        // Fallback to locationX if pageX or sliderLeft unavailable
        const locationX = e.nativeEvent.locationX;
        if (typeof locationX === 'number' && width > 0) {
            const percentage = Math.min(
                Math.max(Math.round((locationX / width) * 100), 0),
                100
            );
            onTipChange(percentage);
        }
    };

    const handleTrackLayout = (e: any) => {
        const { width, x } = e.nativeEvent.layout;
        setSliderWidth(width);
        // Try to get absolute X on screen for pageX calculations
        if (sliderTrackRef.current && sliderTrackRef.current.measureInWindow) {
            try {
                sliderTrackRef.current.measureInWindow(
                    (absX: number, _y: number, _w: number, _h: number) => {
                        setSliderLeft(absX);
                    }
                );
            } catch {
                setSliderLeft(x || 0);
            }
        } else {
            setSliderLeft(x || 0);
        }
    };

    return (
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
                            onTipChange(Math.min(Math.max(num, 0), 100));
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
                    onResponderRelease={() => { }}
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
                            tipPercentage === percentage && styles.quickTipButtonActive,
                        ]}
                        onPress={() => onTipChange(percentage)}
                    >
                        <Text
                            style={[
                                styles.quickTipButtonText,
                                tipPercentage === percentage && styles.quickTipButtonTextActive,
                            ]}
                        >
                            {percentage}%
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
});
