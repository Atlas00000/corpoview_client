'use client'

import { useFinancialStatements } from '@/lib/hooks/useStockData'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area, ComposedChart } from 'recharts'

export interface CashFlowViewerProps {
  symbol: string
}

function formatLargeNumber(value: number): string {
  if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  if (Math.abs(value) >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
  return `$${value.toLocaleString()}`
}

export default function CashFlowViewer({ symbol }: CashFlowViewerProps) {
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

  if (!financials?.cashFlowStatement || financials.cashFlowStatement.length === 0) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <p className="text-slate-500 dark:text-slate-400 text-center py-12">
            No cash flow statement data available
          </p>
        </Card>
      </SlideUp>
    )
  }

  const cashFlowData = financials.cashFlowStatement
    .slice()
    .reverse()
    .map((item: any) => {
      const period = item.calendarYear
        ? `${item.calendarYear} Q${item.period}`
        : item.date || item.calendarYear || 'N/A'
      
      const operating = item.operatingCashFlow || 0
      const investing = item.netCashUsedForInvestingActivites || item.investingCashFlow || item.cashFlowFromInvesting || 0
      const financing = item.netCashUsedProvidedByFinancingActivities || item.financingCashFlow || item.cashFlowFromFinancing || 0
      const freeCashFlow = operating + (item.capitalExpenditure || 0)
      
      return {
        period,
        operatingCashFlow: operating,
        investingCashFlow: investing,
        financingCashFlow: financing,
        freeCashFlow: freeCashFlow,
        capitalExpenditure: item.capitalExpenditure || 0,
        dividendsPaid: item.dividendsPaid || 0,
        netCashFlow: operating + investing + financing,
      }
    })

  const latest = cashFlowData[cashFlowData.length - 1]
  const previous = cashFlowData[cashFlowData.length - 2]

  const calculateGrowth = (current: number, previous: number) => {
    if (!previous || previous === 0) return 0
    return ((current - previous) / Math.abs(previous)) * 100
  }

  const keyMetrics = [
    {
      label: 'Operating Cash Flow',
      current: latest.operatingCashFlow,
      previous: previous?.operatingCashFlow || 0,
      growth: calculateGrowth(latest.operatingCashFlow, previous?.operatingCashFlow || 0),
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Free Cash Flow',
      current: latest.freeCashFlow,
      previous: previous?.freeCashFlow || 0,
      growth: calculateGrowth(latest.freeCashFlow, previous?.freeCashFlow || 0),
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Investing Cash Flow',
      current: latest.investingCashFlow,
      previous: previous?.investingCashFlow || 0,
      growth: calculateGrowth(latest.investingCashFlow, previous?.investingCashFlow || 0),
      color: 'from-amber-500 to-amber-600',
    },
    {
      label: 'Financing Cash Flow',
      current: latest.financingCashFlow,
      previous: previous?.financingCashFlow || 0,
      growth: calculateGrowth(latest.financingCashFlow, previous?.financingCashFlow || 0),
      color: 'from-indigo-500 to-indigo-600',
    },
  ]

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Cash Flow Statement - Last 4 Quarters
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
              Cash Flow Components
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={cashFlowData}>
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
                <Bar dataKey="operatingCashFlow" fill="#10b981" name="Operating" />
                <Bar dataKey="investingCashFlow" fill="#f59e0b" name="Investing" />
                <Bar dataKey="financingCashFlow" fill="#6366f1" name="Financing" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Free Cash Flow Trend
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="colorFreeCashFlow" x1="0" y1="0" x2="0" y2="1">
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
                <Area
                  type="monotone"
                  dataKey="freeCashFlow"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorFreeCashFlow)"
                  name="Free Cash Flow"
                />
              </AreaChart>
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
                {cashFlowData.map((item: typeof cashFlowData[0], index: number) => (
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
                <td colSpan={cashFlowData.length + 1} className="py-2 px-4 font-bold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800">
                  OPERATING ACTIVITIES
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-green-600 dark:text-green-400">
                  Operating Cash Flow
                </td>
                {cashFlowData.map((item: typeof cashFlowData[0], index: number) => (
                  <td key={index} className="py-3 px-4 text-right font-semibold text-green-600 dark:text-green-400">
                    {formatLargeNumber(item.operatingCashFlow)}
                  </td>
                ))}
              </tr>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <td colSpan={cashFlowData.length + 1} className="py-2 px-4 font-bold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800">
                  INVESTING ACTIVITIES
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300">Capital Expenditure</td>
                {cashFlowData.map((item: typeof cashFlowData[0], index: number) => (
                  <td key={index} className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    {formatLargeNumber(item.capitalExpenditure)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-amber-600 dark:text-amber-400">
                  Investing Cash Flow
                </td>
                {cashFlowData.map((item: typeof cashFlowData[0], index: number) => (
                  <td key={index} className="py-3 px-4 text-right font-semibold text-amber-600 dark:text-amber-400">
                    {formatLargeNumber(item.investingCashFlow)}
                  </td>
                ))}
              </tr>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <td colSpan={cashFlowData.length + 1} className="py-2 px-4 font-bold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800">
                  FINANCING ACTIVITIES
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300">Dividends Paid</td>
                {cashFlowData.map((item: typeof cashFlowData[0], index: number) => (
                  <td key={index} className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    {formatLargeNumber(item.dividendsPaid)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-indigo-600 dark:text-indigo-400">
                  Financing Cash Flow
                </td>
                {cashFlowData.map((item: typeof cashFlowData[0], index: number) => (
                  <td key={index} className="py-3 px-4 text-right font-semibold text-indigo-600 dark:text-indigo-400">
                    {formatLargeNumber(item.financingCashFlow)}
                  </td>
                ))}
              </tr>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <td colSpan={cashFlowData.length + 1} className="py-2 px-4 font-bold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800">
                  SUMMARY
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Free Cash Flow</td>
                {cashFlowData.map((item: typeof cashFlowData[0], index: number) => (
                  <td key={index} className="py-3 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatLargeNumber(item.freeCashFlow)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                  Net Change in Cash
                </td>
                {cashFlowData.map((item: typeof cashFlowData[0], index: number) => (
                  <td key={index} className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                    {formatLargeNumber(item.netCashFlow)}
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

