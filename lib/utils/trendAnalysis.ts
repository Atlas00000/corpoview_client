/**
 * Trend analysis utilities for generating narrative text
 */

export interface TrendDataPoint {
  date: string | Date
  value: number
}

export interface TrendAnalysis {
  direction: 'up' | 'down' | 'stable'
  percentage: number
  description: string
  insights: string[]
}

/**
 * Analyze trend from data points
 */
export function analyzeTrend(data: TrendDataPoint[]): TrendAnalysis {
  if (data.length < 2) {
    return {
      direction: 'stable',
      percentage: 0,
      description: 'Insufficient data to analyze trend',
      insights: [],
    }
  }

  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateA - dateB
  })

  const firstValue = sortedData[0].value
  const lastValue = sortedData[sortedData.length - 1].value
  const change = lastValue - firstValue
  const percentage = firstValue !== 0 ? (change / Math.abs(firstValue)) * 100 : 0

  // Calculate volatility (standard deviation of changes)
  const changes = sortedData.slice(1).map((point, index) => {
    const prevValue = sortedData[index].value
    return Math.abs((point.value - prevValue) / prevValue) * 100
  })

  const avgChange = changes.reduce((sum, val) => sum + val, 0) / changes.length
  const volatility = Math.sqrt(
    changes.reduce((sum, val) => sum + Math.pow(val - avgChange, 2), 0) / changes.length
  )

  let direction: 'up' | 'down' | 'stable'
  if (Math.abs(percentage) < 1) {
    direction = 'stable'
  } else {
    direction = percentage > 0 ? 'up' : 'down'
  }

  const insights: string[] = []
  let description = ''

  if (direction === 'up') {
    description = `The value has increased by ${Math.abs(percentage).toFixed(2)}% over the selected period.`
    if (percentage > 10) {
      insights.push('Significant upward trend observed')
    }
    if (volatility > 5) {
      insights.push('High volatility during this period')
    }
  } else if (direction === 'down') {
    description = `The value has decreased by ${Math.abs(percentage).toFixed(2)}% over the selected period.`
    if (Math.abs(percentage) > 10) {
      insights.push('Significant downward trend observed')
    }
    if (volatility > 5) {
      insights.push('High volatility during this period')
    }
  } else {
    description = 'The value has remained relatively stable over the selected period.'
    insights.push('Minimal price movement detected')
  }

  // Find peak and trough
  const values = sortedData.map((d) => d.value)
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const maxIndex = values.indexOf(maxValue)
  const minIndex = values.indexOf(minValue)

  if (maxIndex < minIndex) {
    insights.push('Peak value occurred before the lowest point, indicating a potential reversal')
  }

  if (volatility < 2) {
    insights.push('Low volatility suggests stable market conditions')
  }

  return {
    direction,
    percentage: Math.abs(percentage),
    description,
    insights,
  }
}

/**
 * Generate narrative text from trend analysis
 */
export function generateNarrative(
  trend: TrendAnalysis,
  assetName: string = 'Asset'
): string {
  let narrative = `**${assetName} Performance Analysis**\n\n${trend.description}\n\n`

  if (trend.insights.length > 0) {
    narrative += '**Key Observations:**\n'
    trend.insights.forEach((insight) => {
      narrative += `- ${insight}\n`
    })
  }

  return narrative
}

