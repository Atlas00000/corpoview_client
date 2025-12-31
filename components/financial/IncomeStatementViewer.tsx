'use client'

import { useFinancialStatements } from '@/lib/hooks/useStockData'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'

export interface IncomeStatementViewerProps {
  symbol: string
}

function formatLargeNumber(value: number): string {
  if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  if (Math.abs(value) >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
  return `$${value.toLocaleString()}`
}

export default function IncomeStatementViewer({ symbol }: IncomeStatementViewerProps) {
  const { financials, isLoading } = useFinancialStatements(symbol, 4)

  if (isLoading) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <Skeleton height={600} className="rounded-xl" />
        </Card>
      </SlideUp>
    )
  }

  if (!financials?.incomeStatement || financials.incomeStatement.length === 0) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <p className="text-slate-500 dark:text-slate-400 text-center py-12">
            No income statement data available
          </p>
        </Card>
      </SlideUp>
    )
  }

  const incomeData = financials.incomeStatement
    .slice()
    .reverse()
    .map((item: any) => {
      const period = item.calendarYear
        ? `${item.calendarYear} Q${item.period}`
        : item.date || item.calendarYear || 'N/A'
      
      return {
        period,
        revenue: item.revenue || 0,
        costOfRevenue: item.costOfRevenue || item.costOfGoodsAndServicesSold || 0,
        grossProfit: item.grossProfit || 0,
        operatingExpenses: item.operatingExpenses || 0,
        operatingIncome: item.operatingIncome || 0,
        ebitda: item.ebitda || 0,
        netIncome: item.netIncome || 0,
        earningsPerShare: item.eps || item.epsdiluted || 0,
      }
    })

  const chartData = incomeData.map((item) => ({
    ...item,
    grossMargin: item.revenue > 0 ? (item.grossProfit / item.revenue) * 100 : 0,
    operatingMargin: item.revenue > 0 ? (item.operatingIncome / item.revenue) * 100 : 0,
    netMargin: item.revenue > 0 ? (item.netIncome / item.revenue) * 100 : 0,
  }))

  const latest = incomeData[incomeData.length - 1]
  const previous = incomeData[incomeData.length - 2]

  const calculateGrowth = (current: number, previous: number) => {
    if (!previous || previous === 0) return 0
    return ((current - previous) / Math.abs(previous)) * 100
  }

  const keyMetrics = [
    {
      label: 'Revenue',
      current: latest.revenue,
      previous: previous?.revenue || 0,
      growth: calculateGrowth(latest.revenue, previous?.revenue || 0),
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Gross Profit',
      current: latest.grossProfit,
      previous: previous?.grossProfit || 0,
      growth: calculateGrowth(latest.grossProfit, previous?.grossProfit || 0),
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Operating Income',
      current: latest.operatingIncome,
      previous: previous?.operatingIncome || 0,
      growth: calculateGrowth(latest.operatingIncome, previous?.operatingIncome || 0),
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Net Income',
      current: latest.netIncome,
      previous: previous?.netIncome || 0,
      growth: calculateGrowth(latest.netIncome, previous?.netIncome || 0),
      color: 'from-indigo-500 to-indigo-600',
    },
  ]

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Income Statement - Last 4 Quarters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {keyMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-2xl bg-gradient-to-br ${metric.color} text-white shadow-lg`}
            >
              <p className="text-sm font-medium opacity-90 mb-2">{metric.label}</p>
              <p className="text-2xl font-bold mb-1">{formatLargeNumber(metric.current)}</p>
              {metric.previous > 0 && (
                <p className="text-xs opacity-80">
                  {metric.growth >= 0 ? '+' : ''}
                  {metric.growth.toFixed(1)}% vs previous
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Revenue & Profit Trends
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="period"
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  tickFormatter={(value) => formatLargeNumber(value)}
                />
                <Tooltip
                  formatter={(value: number) => formatLargeNumber(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                <Bar dataKey="grossProfit" fill="#10b981" name="Gross Profit" />
                <Bar dataKey="netIncome" fill="#6366f1" name="Net Income" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Profitability Margins
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="period"
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="grossMargin"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Gross Margin %"
                />
                <Line
                  type="monotone"
                  dataKey="operatingMargin"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Operating Margin %"
                />
                <Line
                  type="monotone"
                  dataKey="netMargin"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Net Margin %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overflow-x-auto">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Detailed Statement
          </h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Metric
                </th>
                {incomeData.map((item, index) => (
                  <th
                    key={index}
                    className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    {item.period}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                  Revenue
                </td>
                {incomeData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                    {formatLargeNumber(item.revenue)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300">Cost of Revenue</td>
                {incomeData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    {formatLargeNumber(item.costOfRevenue)}
                  </td>
                ))}
              </tr>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-green-600 dark:text-green-400">
                  Gross Profit
                </td>
                {incomeData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right font-semibold text-green-600 dark:text-green-400">
                    {formatLargeNumber(item.grossProfit)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300">Operating Expenses</td>
                {incomeData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    {formatLargeNumber(item.operatingExpenses)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-purple-600 dark:text-purple-400">
                  Operating Income
                </td>
                {incomeData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right font-semibold text-purple-600 dark:text-purple-400">
                    {formatLargeNumber(item.operatingIncome)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300">EBITDA</td>
                {incomeData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    {formatLargeNumber(item.ebitda)}
                  </td>
                ))}
              </tr>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                  Net Income
                </td>
                {incomeData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                    {formatLargeNumber(item.netIncome)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300">Earnings Per Share</td>
                {incomeData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    ${item.earningsPerShare.toFixed(2)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </SlideUp>
  )
}

