import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, severityConfig } from '../../theme/colors';

/**
 * AI analysis result card
 * Shows detection, confidence, features, indicators
 */
export default function AIAnalysisCard({ aiAnalysis }) {
  if (!aiAnalysis?.analyzed) {
    return null;
  }

  const {
    accidentDetected,
    confidence = 0,
    predictedSeverity = 'medium',
    features = {},
    indicators = [],
  } = aiAnalysis;

  const sev = severityConfig[predictedSeverity] || severityConfig.medium;
  const confidencePct = Math.round(confidence * 100);

  return (
    <View className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-xl bg-brand/15 items-center justify-center mr-3">
          <Ionicons name="hardware-chip" size={20} color={colors.brand} />
        </View>
        <View className="flex-1">
          <Text className="text-content font-bold text-base">AI Analysis</Text>
          <Text className="text-content-muted text-xs mt-0.5">
            Automated image detection
          </Text>
        </View>
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: sev.bg }}
        >
          <Text
            className="text-2xs font-bold tracking-wider"
            style={{ color: sev.color }}
          >
            {sev.label.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Status row */}
      <View className="flex-row items-center justify-between py-3 border-t border-b border-bg-border">
        <View className="flex-row items-center">
          <Ionicons
            name={accidentDetected ? 'warning' : 'checkmark-circle'}
            size={16}
            color={accidentDetected ? colors.danger : colors.success}
          />
          <Text className="text-content text-sm ml-2 font-medium">
            {accidentDetected ? 'Accident detected' : 'No accident detected'}
          </Text>
        </View>
        <Text className="text-content-secondary text-sm font-bold">
          {confidencePct}%
        </Text>
      </View>

      {/* Confidence bar */}
      <View className="mt-3">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-content-muted text-2xs font-bold tracking-widest">
            CONFIDENCE
          </Text>
          <Text className="text-content-secondary text-2xs font-semibold">
            {confidencePct}%
          </Text>
        </View>
        <View className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${confidencePct}%`,
              backgroundColor: sev.color,
            }}
          />
        </View>
      </View>

      {/* Indicators */}
      {indicators.length > 0 && (
        <View className="mt-4">
          <Text className="text-content-muted text-2xs font-bold tracking-widest mb-2">
            DETECTED INDICATORS
          </Text>
          {indicators.map((indicator, index) => (
            <View key={index} className="flex-row items-center mb-1.5">
              <View
                className="w-1.5 h-1.5 rounded-full mr-2"
                style={{ backgroundColor: colors.warning }}
              />
              <Text className="text-content-secondary text-xs flex-1">
                {indicator}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Features (collapsed view) */}
      {features && Object.keys(features).length > 0 && (
        <View className="mt-4 pt-3 border-t border-bg-border">
          <Text className="text-content-muted text-2xs font-bold tracking-widest mb-2">
            FEATURE ANALYSIS
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {features.red_ratio !== undefined && (
              <FeatureChip
                label="Red"
                value={features.red_ratio}
                color={colors.danger}
              />
            )}
            {features.edge_density !== undefined && (
              <FeatureChip
                label="Edges"
                value={features.edge_density}
                color={colors.warning}
              />
            )}
            {features.brightness !== undefined && (
              <FeatureChip
                label="Brightness"
                value={features.brightness}
                color={colors.info}
              />
            )}
            {features.vehicle_count !== undefined && (
              <FeatureChip
                label="Vehicles"
                value={features.vehicle_count}
                color={colors.success}
                isCount
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}

function FeatureChip({ label, value, color, isCount = false }) {
  const displayValue = isCount
    ? value
    : typeof value === 'number'
    ? value.toFixed(2)
    : value;
  return (
    <View
      className="px-3 py-2 rounded-xl flex-row items-center"
      style={{ backgroundColor: `${color}15` }}
    >
      <Text className="text-content-muted text-2xs font-bold tracking-wide mr-1.5">
        {label}
      </Text>
      <Text className="text-xs font-bold" style={{ color }}>
        {displayValue}
      </Text>
    </View>
  );
}