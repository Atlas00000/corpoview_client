'use client'

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export interface BarChartDataPoint {
  name: string
  [key: string]: string | number
}

export interface BarChartProps {
  data: BarChartDataPoint[]
  width?: number
  height?: number
  dataKeys: string[]
  colors?: string[]
  showLegend?: boolean
  showGrid?: boolean
  showDataLabels?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  className?: string
}

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function BarChart({
  data,
  width = 800,
  height = 400,
  dataKeys,
  colors = DEFAULT_COLORS,
  showLegend = true,
  showGrid = true,
  showDataLabels = false,
  xAxisLabel,
  yAxisLabel,
  className = '',
}: BarChartProps) {
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Responsive height for mobile
  const getResponsiveHeight = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return Math.min(height, 300)
    }
    return height
  }

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={getResponsiveHeight()}>
        <RechartsBarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />}
          <XAxis
            dataKey="name"
            className="text-gray-600 dark:text-gray-400"
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
          />
          <YAxis
            className="text-gray-600 dark:text-gray-400"
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          />
          <Tooltip content={customTooltip} />
          {showLegend && (
            <Legend
              formatter={(value) => <span className="text-gray-700 dark:text-gray-300">{value}</span>}
            />
          )}
          {dataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
              animationDuration={800}
              animationEasing="ease-out"
              label={showDataLabels ? { position: 'top' } : undefined}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

