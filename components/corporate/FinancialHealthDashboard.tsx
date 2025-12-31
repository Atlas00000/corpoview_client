'use client'

import { useState } from 'react'
import { useFinancialStatements } from '@/lib/hooks/useStockData'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export interface FinancialHealthDashboardProps {
  symbol: string
}

function formatLargeNumber(value: number): string {
  if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}

export default function FinancialHealthDashboard({ symbol }: FinancialHealthDashboardProps) {
  const { financials, isLoading } = useFinancialStatements(symbol, 5)
  const [activeTab, setActiveTab] = useState<'income' | 'balance' | 'cashflow'>('income')

  if (isLoading) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <Skeleton height={500} className="rounded-xl" />
        </Card>
      </SlideUp>
    )
  }

  if (!financials) return null

  const incomeData = financials.incomeStatement
    ?.slice()
    .reverse()
    .map((item: any) => ({
      period: item.calendarYear || item.date || 'N/A',
      revenue: item.revenue || 0,
      netIncome: item.netIncome || 0,
      operatingIncome: item.operatingIncome || 0,
    })) || []

  const balanceData = financials.balanceSheet
    ?.slice()
    .reverse()
    .map((item: any) => ({
      period: item.calendarYear || item.date || 'N/A',
      totalAssets: item.totalAssets || 0,
      totalLiabilities: item.totalLiabilities || 0,
      totalEquity: item.totalStockholdersEquity || item.totalEquity || 0,
    })) || []

  const cashFlowData = financials.cashFlowStatement
    ?.slice()
    .reverse()
    .map((item: any) => ({
      period: item.calendarYear || item.date || 'N/A',
      operatingCashFlow: item.operatingCashFlow || 0,
      investingCashFlow: item.netCashUsedForInvestingActivites || item.investingCashFlow || 0,
      financingCashFlow: item.netCashUsedProvidedByFinancingActivities || item.financingCashFlow || 0,
    })) || []

  const tabs = [
    { id: 'income' as const, label: 'Income Statement', data: incomeData },
    { id: 'balance' as const, label: 'Balance Sheet', data: balanceData },
    { id: 'cashflow' as const, label: 'Cash Flow', data: cashFlowData },
  ]

  const renderIncomeChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={incomeData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="period"
          stroke="#64748b"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#64748b"
          style={{ fontSize: '12px' }}
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
        <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
        <Bar dataKey="operatingIncome" fill="#10b981" name="Operating Income" />
        <Bar dataKey="netIncome" fill="#6366f1" name="Net Income" />
      </BarChart>
    </ResponsiveContainer>
  )

  const renderBalanceChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={balanceData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="period"
          stroke="#64748b"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#64748b"
          style={{ fontSize: '12px' }}
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
        <Line
          type="monotone"
          dataKey="totalAssets"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Total Assets"
        />
        <Line
          type="monotone"
          dataKey="totalLiabilities"
          stroke="#f43f5e"
          strokeWidth={2}
          name="Total Liabilities"
        />
        <Line
          type="monotone"
          dataKey="totalEquity"
          stroke="#10b981"
          strokeWidth={2}
          name="Total Equity"
        />
      </LineChart>
    </ResponsiveContainer>
  )

  const renderCashFlowChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={cashFlowData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="period"
          stroke="#64748b"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#64748b"
          style={{ fontSize: '12px' }}
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
        <Bar dataKey="operatingCashFlow" fill="#10b981" name="Operating" />
        <Bar dataKey="investingCashFlow" fill="#f59e0b" name="Investing" />
        <Bar dataKey="financingCashFlow" fill="#6366f1" name="Financing" />
      </BarChart>
    </ResponsiveContainer>
  )

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Financial Health Dashboard
        </h3>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'income' && renderIncomeChart()}
          {activeTab === 'balance' && renderBalanceChart()}
          {activeTab === 'cashflow' && renderCashFlowChart()}
        </motion.div>

        {activeTab === 'income' && incomeData.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Latest Revenue
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatLargeNumber(incomeData[incomeData.length - 1]?.revenue || 0)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Latest Operating Income
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatLargeNumber(incomeData[incomeData.length - 1]?.operatingIncome || 0)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border border-indigo-200 dark:border-indigo-800">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Latest Net Income
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatLargeNumber(incomeData[incomeData.length - 1]?.netIncome || 0)}
              </p>
            </div>
          </div>
        )}
      </Card>
    </SlideUp>
  )
}

