/**
 * Chart configuration utilities and default settings
 */

export const DEFAULT_CHART_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899',
  cyan: '#06b6d4',
  lime: '#84cc16',
}

export const CHART_COLOR_PALETTES = {
  default: [
    DEFAULT_CHART_COLORS.primary,
    DEFAULT_CHART_COLORS.success,
    DEFAULT_CHART_COLORS.warning,
    DEFAULT_CHART_COLORS.danger,
    DEFAULT_CHART_COLORS.purple,
    DEFAULT_CHART_COLORS.pink,
    DEFAULT_CHART_COLORS.cyan,
    DEFAULT_CHART_COLORS.lime,
  ],
  cool: ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#10b981'],
  warm: ['#ef4444', '#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7'],
  monochrome: ['#1f2937', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db'],
}

export interface ChartTheme {
  colors: string[]
  gridColor: string
  textColor: string
  backgroundColor: string
}

export const LIGHT_THEME: ChartTheme = {
  colors: CHART_COLOR_PALETTES.default,
  gridColor: '#e5e7eb',
  textColor: '#374151',
  backgroundColor: '#ffffff',
}

export const DARK_THEME: ChartTheme = {
  colors: CHART_COLOR_PALETTES.default,
  gridColor: '#374151',
  textColor: '#f3f4f6',
  backgroundColor: '#1f2937',
}

/**
 * Get chart theme based on dark mode preference
 */
export function getChartTheme(isDark: boolean = false): ChartTheme {
  return isDark ? DARK_THEME : LIGHT_THEME
}

/**
 * Chart size presets
 */
export const CHART_SIZES = {
  small: { width: 400, height: 300 },
  medium: { width: 600, height: 400 },
  large: { width: 800, height: 500 },
  full: { width: '100%', height: 400 },
} as const

/**
 * Animation presets
 */
export const ANIMATION_CONFIG = {
  duration: 800,
  easing: 'ease-out',
  delay: 0,
}

/**
 * Responsive breakpoints for charts
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

/**
 * Get responsive chart dimensions
 */
export function getResponsiveChartDimensions(
  containerWidth: number,
  aspectRatio: number = 16 / 9
) {
  const width = containerWidth
  const height = width / aspectRatio

  return {
    width: Math.max(300, width),
    height: Math.max(200, height),
  }
}

