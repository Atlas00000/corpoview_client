/**
 * Depth/Elevation System
 * Provides consistent elevation levels for layered UI elements
 */

export type ElevationLevel = 0 | 1 | 2 | 3 | 4

export interface DepthStyles {
  shadow: string
  zIndex: number
  transform: string
}

export const elevationStyles: Record<ElevationLevel, DepthStyles> = {
  0: {
    shadow: 'shadow-none',
    zIndex: 0,
    transform: 'translateY(0)',
  },
  1: {
    shadow: 'shadow-sm',
    zIndex: 10,
    transform: 'translateY(0)',
  },
  2: {
    shadow: 'shadow-md',
    zIndex: 20,
    transform: 'translateY(-2px)',
  },
  3: {
    shadow: 'shadow-lg',
    zIndex: 30,
    transform: 'translateY(-4px)',
  },
  4: {
    shadow: 'shadow-xl',
    zIndex: 40,
    transform: 'translateY(-6px)',
  },
}

/**
 * Get depth styles for a given elevation level
 */
export function getDepthStyles(level: ElevationLevel): DepthStyles {
  return elevationStyles[level]
}

/**
 * Get combined className for depth styling
 */
export function getDepthClass(level: ElevationLevel, hover?: boolean): string {
  const styles = elevationStyles[level]
  const baseClass = `${styles.shadow} z-${styles.zIndex}`
  
  if (hover) {
    const nextLevel = Math.min(level + 1, 4) as ElevationLevel
    const hoverStyles = elevationStyles[nextLevel]
    return `${baseClass} transition-all duration-200 hover:${hoverStyles.shadow} hover:${hoverStyles.transform}`
  }
  
  return baseClass
}

/**
 * Get z-index class for a given elevation level
 */
export function getZIndexClass(level: ElevationLevel): string {
  return `z-${elevationStyles[level].zIndex}`
}

