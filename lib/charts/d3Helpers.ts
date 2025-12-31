import * as d3 from 'd3'

export interface D3Margins {
  top: number
  right: number
  bottom: number
  left: number
}

export const defaultMargins: D3Margins = {
  top: 20,
  right: 30,
  bottom: 40,
  left: 50,
}

/**
 * Calculate chart dimensions based on container width and margins
 */
export function calculateChartDimensions(
  containerWidth: number,
  height: number,
  margins: D3Margins = defaultMargins
) {
  return {
    width: Math.max(300, containerWidth - margins.left - margins.right),
    height: Math.max(200, height - margins.top - margins.bottom),
    margins,
  }
}

/**
 * Create D3 scales for line charts
 */
export function createScales(
  data: any[],
  xKey: string,
  yKey: string,
  width: number,
  height: number
) {
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => new Date(d[xKey])) as [Date, Date])
    .range([0, width])

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d[yKey]) as [number, number])
    .nice()
    .range([height, 0])

  return { xScale, yScale }
}

/**
 * Create D3 line generator
 */
export function createLineGenerator(
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  xKey: string,
  yKey: string
) {
  return d3
    .line<any>()
    .x((d) => xScale(new Date(d[xKey])))
    .y((d) => yScale(d[yKey]))
    .curve(d3.curveMonotoneX)
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return d3.timeFormat('%Y-%m-%d')(date)
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: Date): string {
  return d3.timeFormat('%Y-%m-%d %H:%M')(date)
}

/**
 * Format number with commas
 */
export function formatNumber(value: number): string {
  return d3.format(',')(value)
}

/**
 * Format currency
 */
export function formatCurrency(value: number, currency: string = '$'): string {
  return `${currency}${d3.format(',.2f')(value)}`
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${d3.format('.2f')(value)}%`
}

