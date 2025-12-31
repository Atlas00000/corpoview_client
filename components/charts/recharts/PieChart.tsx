'use client'

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

export interface PieChartDataPoint {
  name: string
  value: number
  color?: string
}

export interface PieChartProps {
  data: PieChartDataPoint[]
  width?: number
  height?: number
  innerRadius?: number
  outerRadius?: number
  showLegend?: boolean
  showLabel?: boolean
  colors?: string[]
  className?: string
}

const DEFAULT_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
]

export default function PieChart({
  data,
  width = 400,
  height = 400,
  innerRadius = 0,
  outerRadius,
  showLegend = true,
  showLabel = false,
  colors = DEFAULT_COLORS,
  className = '',
}: PieChartProps) {
  // Responsive outer radius based on screen size
  const getResponsiveOuterRadius = () => {
    if (outerRadius !== undefined) return outerRadius
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 60 // Smaller on mobile
    }
    return 80
  }

  const responsiveOuterRadius = getResponsiveOuterRadius()
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || colors[index % colors.length],
  }))

  const renderLabel = (entry: any) => {
    if (!showLabel) return null
    return `${entry.name}: ${entry.value.toLocaleString()}`
  }

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Value: {data.value.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Percent: {((data.value / data.payload.total) * 100).toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const dataWithTotal = chartData.map((item) => ({ ...item, total }))

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            labelLine={showLabel}
            label={renderLabel}
            outerRadius={responsiveOuterRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={customTooltip} />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry: any) => (
                <span className="text-gray-700 dark:text-gray-300">{value}</span>
              )}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

