'use client'

import { useFinancialStatements } from '@/lib/hooks/useStockData'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area } from 'recharts'

export interface BalanceSheetViewerProps {
  symbol: string
}

function formatLargeNumber(value: number): string {
  if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  if (Math.abs(value) >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
  return `$${value.toLocaleString()}`
}

export default function BalanceSheetViewer({ symbol }: BalanceSheetViewerProps) {
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

  if (!financials?.balanceSheet || financials.balanceSheet.length === 0) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <p className="text-slate-500 dark:text-slate-400 text-center py-12">
            No balance sheet data available
          </p>
        </Card>
      </SlideUp>
    )
  }

  const balanceData = financials.balanceSheet
    .slice()
    .reverse()
    .map((item: any) => {
      const period = item.calendarYear
        ? `${item.calendarYear} Q${item.period}`
        : item.date || item.calendarYear || 'N/A'
      
      return {
        period,
        totalAssets: item.totalAssets || 0,
        totalCurrentAssets: item.totalCurrentAssets || 0,
        cashAndCashEquivalents: item.cashAndCashEquivalents || item.cashAndShortTermInvestments || 0,
        inventory: item.inventory || 0,
        totalLiabilities: item.totalLiabilities || 0,
        totalCurrentLiabilities: item.totalCurrentLiabilities || 0,
        longTermDebt: item.longTermDebt || 0,
        totalEquity: item.totalStockholdersEquity || item.totalEquity || 0,
        retainedEarnings: item.retainedEarnings || 0,
      }
    })

  const latest = balanceData[balanceData.length - 1]
  const previous = balanceData[balanceData.length - 2]

  const calculateGrowth = (current: number, previous: number) => {
    if (!previous || previous === 0) return 0
    return ((current - previous) / Math.abs(previous)) * 100
  }

  const calculateDebtToEquity = (debt: number, equity: number) => {
    if (!equity || equity === 0) return 0
    return (debt / equity) * 100
  }

  const calculateCurrentRatio = (currentAssets: number, currentLiabilities: number) => {
    if (!currentLiabilities || currentLiabilities === 0) return 0
    return currentAssets / currentLiabilities
  }

  const keyMetrics = [
    {
      label: 'Total Assets',
      current: latest.totalAssets,
      previous: previous?.totalAssets || 0,
      growth: calculateGrowth(latest.totalAssets, previous?.totalAssets || 0),
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Total Equity',
      current: latest.totalEquity,
      previous: previous?.totalEquity || 0,
      growth: calculateGrowth(latest.totalEquity, previous?.totalEquity || 0),
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Total Liabilities',
      current: latest.totalLiabilities,
      previous: previous?.totalLiabilities || 0,
      growth: calculateGrowth(latest.totalLiabilities, previous?.totalLiabilities || 0),
      color: 'from-rose-500 to-rose-600',
    },
    {
      label: 'Cash & Equivalents',
      current: latest.cashAndCashEquivalents,
      previous: previous?.cashAndCashEquivalents || 0,
      growth: calculateGrowth(latest.cashAndCashEquivalents, previous?.cashAndCashEquivalents || 0),
      color: 'from-emerald-500 to-emerald-600',
    },
  ]

  const ratiosData = balanceData.map((item) => ({
    ...item,
    debtToEquity: calculateDebtToEquity(item.longTermDebt, item.totalEquity),
    currentRatio: calculateCurrentRatio(item.totalCurrentAssets, item.totalCurrentLiabilities),
    equityRatio: item.totalAssets > 0 ? (item.totalEquity / item.totalAssets) * 100 : 0,
  }))

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Balance Sheet - Last 4 Quarters
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
              Assets, Liabilities & Equity
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={balanceData}>
                <defs>
                  <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLiabilities" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="totalAssets"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorAssets)"
                  name="Total Assets"
                />
                <Area
                  type="monotone"
                  dataKey="totalLiabilities"
                  stroke="#f43f5e"
                  fillOpacity={1}
                  fill="url(#colorLiabilities)"
                  name="Total Liabilities"
                />
                <Area
                  type="monotone"
                  dataKey="totalEquity"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorEquity)"
                  name="Total Equity"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Financial Ratios
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ratiosData}>
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
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'Current Ratio') return value.toFixed(2)
                    return `${value.toFixed(1)}%`
                  }}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="currentRatio"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Current Ratio"
                />
                <Line
                  type="monotone"
                  dataKey="debtToEquity"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  name="Debt to Equity %"
                />
                <Line
                  type="monotone"
                  dataKey="equityRatio"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Equity Ratio %"
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
                {balanceData.map((item, index) => (
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
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <td colSpan={balanceData.length + 1} className="py-2 px-4 font-bold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800">
                  ASSETS
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                  Total Assets
                </td>
                {balanceData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right font-semibold text-blue-600 dark:text-blue-400">
                    {formatLargeNumber(item.totalAssets)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 pl-8">Current Assets</td>
                {balanceData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    {formatLargeNumber(item.totalCurrentAssets)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 pl-12">Cash & Equivalents</td>
                {balanceData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    {formatLargeNumber(item.cashAndCashEquivalents)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 pl-12">Inventory</td>
                {balanceData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    {formatLargeNumber(item.inventory)}
                  </td>
                ))}
              </tr>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <td colSpan={balanceData.length + 1} className="py-2 px-4 font-bold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800">
                  LIABILITIES
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                  Total Liabilities
                </td>
                {balanceData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right font-semibold text-rose-600 dark:text-rose-400">
                    {formatLargeNumber(item.totalLiabilities)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 pl-8">Current Liabilities</td>
                {balanceData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    {formatLargeNumber(item.totalCurrentLiabilities)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 pl-8">Long Term Debt</td>
                {balanceData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    {formatLargeNumber(item.longTermDebt)}
                  </td>
                ))}
              </tr>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <td colSpan={balanceData.length + 1} className="py-2 px-4 font-bold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800">
                  EQUITY
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                  Total Equity
                </td>
                {balanceData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right font-semibold text-green-600 dark:text-green-400">
                    {formatLargeNumber(item.totalEquity)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 pl-8">Retained Earnings</td>
                {balanceData.map((item, index) => (
                  <td key={index} className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    {formatLargeNumber(item.retainedEarnings)}
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

