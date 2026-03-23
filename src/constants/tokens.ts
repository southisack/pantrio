// Design tokens for Pantrio
// Reference TASTE.md before modifying — colorful, saturated, never safe

export const Colors = {
  // Primary palette — energetic, high-conviction
  brand: '#FF4D00',        // main brand orange — loud, not warm
  brandAlt: '#FFE600',     // electric yellow — accent, CTAs, confidence indicators
  surface: '#0F0F0F',      // near-black background — makes colors pop
  surfaceCard: '#1A1A1A',  // card/surface background
  surfaceElevated: '#242424',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#606060',

  // Confidence levels
  confidenceHigh: '#00E676',   // green
  confidenceMedium: '#FFB300', // amber
  confidenceLow: '#FF3D00',    // red-orange — needs attention

  // State colors
  error: '#FF3D3D',
  success: '#00E676',

  // Utility
  border: '#2A2A2A',
  overlay: 'rgba(0,0,0,0.6)',
} as const;

export const Typography = {
  // Sizes
  size: {
    xs: 11,
    sm: 13,
    base: 16,
    md: 18,
    lg: 22,
    xl: 28,
    '2xl': 36,
    '3xl': 48,
  },

  // Weights — React Native uses string literals
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '900' as const,
  },

  // Line heights
  leading: {
    tight: 1.1,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.7,
  },
} as const;

export const Spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const Radius = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  full: 9999,
} as const;
