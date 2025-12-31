'use client'

import { useFinancialStatements, useCompanyOverview } from '@/lib/hooks/useStockData'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts'

export interface FinancialRatiosProps {
  symbol: string
}

function formatNumber(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return 'N/A'
  return value.toFixed(decimals)
}

function formatPercent(value: number): string {
  if (isNaN(value) || !isFinite(value)) return 'N/A'
  return `${value.toFixed(2)}%`
}

export default function FinancialRatios({ symbol }: FinancialRatiosProps) {
  const { financials, isLoading: financialsLoading } = useFinancialStatements(symbol, 1)
  const { overview, isLoading: overviewLoading } = useCompanyOverview(symbol)

  if (financialsLoading || overviewLoading) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <Skeleton height={600} className="rounded-xl" />
        </Card>
      </SlideUp>
    )
  }

  if (!financials && !overview) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <p className="text-slate-500 dark:text-slate-400 text-center py-12">
            No financial ratios data available
          </p>
        </Card>
      </SlideUp>
    )
  }

  const income = financials?.incomeStatement?.[0]
  const balance = financials?.balanceSheet?.[0]
  const cashFlow = financials?.cashFlowStatement?.[0]

  const revenue = income?.revenue || 0
  const netIncome = income?.netIncome || 0
  const grossProfit = income?.grossProfit || 0
  const operatingIncome = income?.operatingIncome || 0
  const totalAssets = balance?.totalAssets || 0
  const totalEquity = balance?.totalStockholdersEquity || balance?.totalEquity || 0
  const totalLiabilities = balance?.totalLiabilities || 0
  const currentAssets = balance?.totalCurrentAssets || 0
  const currentLiabilities = balance?.totalCurrentLiabilities || 0
  const longTermDebt = balance?.longTermDebt || 0
  const operatingCashFlow = cashFlow?.operatingCashFlow || 0
  const capitalExpenditure = cashFlow?.capitalExpenditure || 0
  const freeCashFlow = operatingCashFlow + capitalExpenditure

  const marketCap = overview?.MarketCapitalization ? parseFloat(overview.MarketCapitalization) : 0
  const eps = overview?.EPS ? parseFloat(overview.EPS) : 0
  const price = overview?.PERatio && eps ? parseFloat(overview.PERatio) * eps : 0
  const sharesOutstanding = price > 0 && eps > 0 ? netIncome / eps : 0

  const ratios = {
    profitability: {
      grossMargin: revenue > 0 ? (grossProfit / revenue) * 100 : 0,
      operatingMargin: revenue > 0 ? (operatingIncome / revenue) * 100 : 0,
      netMargin: revenue > 0 ? (netIncome / revenue) * 100 : 0,
      roa: totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0,
      roe: totalEquity > 0 ? (netIncome / totalEquity) * 100 : 0,
      roic: totalAssets > 0 ? (operatingIncome / totalAssets) * 100 : 0,
    },
    liquidity: {
      currentRatio: currentLiabilities > 0 ? currentAssets / currentLiabilities : 0,
      quickRatio: currentLiabilities > 0 ? (currentAssets - (balance?.inventory || 0)) / currentLiabilities : 0,
      cashRatio: currentLiabilities > 0 ? (balance?.cashAndCashEquivalents || balance?.cashAndShortTermInvestments || 0) / currentLiabilities : 0,
    },
    leverage: {
      debtToEquity: totalEquity > 0 ? (longTermDebt / totalEquity) * 100 : 0,
      debtToAssets: totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0,
      equityRatio: totalAssets > 0 ? (totalEquity / totalAssets) * 100 : 0,
      interestCoverage: income?.interestExpense ? operatingIncome / Math.abs(income.interestExpense) : 0,
    },
    valuation: {
      peRatio: eps > 0 && price > 0 ? price / eps : overview?.PERatio ? parseFloat(overview.PERatio) : 0,
      priceToBook: totalEquity > 0 && sharesOutstanding > 0 ? (marketCap / (totalEquity / sharesOutstanding * sharesOutstanding)) : 0,
      evToEbitda: operatingIncome > 0 && marketCap > 0 ? marketCap / operatingIncome : 0,
      priceToSales: revenue > 0 && sharesOutstanding > 0 ? marketCap / revenue : 0,
    },
    efficiency: {
      assetTurnover: totalAssets > 0 ? revenue / totalAssets : 0,
      inventoryTurnover: balance?.inventory > 0 ? income?.costOfRevenue / balance.inventory : 0,
      receivablesTurnover: balance?.netReceivables > 0 ? revenue / balance.netReceivables : 0,
    },
    cashFlow: {
      operatingCashFlowMargin: revenue > 0 ? (operatingCashFlow / revenue) * 100 : 0,
      freeCashFlowYield: marketCap > 0 ? (freeCashFlow / marketCap) * 100 : 0,
      cashFlowToDebt: longTermDebt > 0 ? (operatingCashFlow / longTermDebt) * 100 : 0,
    },
  }

  const profitabilityData = [
    { name: 'Gross Margin', value: ratios.profitability.grossMargin, fullMark: 50 },
    { name: 'Operating Margin', value: ratios.profitability.operatingMargin, fullMark: 30 },
    { name: 'Net Margin', value: ratios.profitability.netMargin, fullMark: 20 },
    { name: 'ROA', value: Math.min(ratios.profitability.roa, 30), fullMark: 30 },
    { name: 'ROE', value: Math.min(ratios.profitability.roe, 50), fullMark: 50 },
    { name: 'ROIC', value: Math.min(ratios.profitability.roic, 30), fullMark: 30 },
  ]

  const metricCards = [
    {
      category: 'Profitability',
      metrics: [
        { label: 'Gross Margin', value: formatPercent(ratios.profitability.grossMargin), color: 'from-blue-500 to-blue-600' },
        { label: 'Operating Margin', value: formatPercent(ratios.profitability.operatingMargin), color: 'from-purple-500 to-purple-600' },
        { label: 'Net Margin', value: formatPercent(ratios.profitability.netMargin), color: 'from-indigo-500 to-indigo-600' },
        { label: 'ROA', value: formatPercent(ratios.profitability.roa), color: 'from-green-500 to-green-600' },
        { label: 'ROE', value: formatPercent(ratios.profitability.roe), color: 'from-emerald-500 to-emerald-600' },
        { label: 'ROIC', value: formatPercent(ratios.profitability.roic), color: 'from-teal-500 to-teal-600' },
      ],
    },
    {
      category: 'Liquidity',
      metrics: [
        { label: 'Current Ratio', value: formatNumber(ratios.liquidity.currentRatio), color: 'from-blue-500 to-blue-600' },
        { label: 'Quick Ratio', value: formatNumber(ratios.liquidity.quickRatio), color: 'from-cyan-500 to-cyan-600' },
        { label: 'Cash Ratio', value: formatNumber(ratios.liquidity.cashRatio), color: 'from-sky-500 to-sky-600' },
      ],
    },
    {
      category: 'Leverage',
      metrics: [
        { label: 'Debt to Equity', value: formatPercent(ratios.leverage.debtToEquity), color: 'from-rose-500 to-rose-600' },
        { label: 'Debt to Assets', value: formatPercent(ratios.leverage.debtToAssets), color: 'from-red-500 to-red-600' },
        { label: 'Equity Ratio', value: formatPercent(ratios.leverage.equityRatio), color: 'from-green-500 to-green-600' },
        { label: 'Interest Coverage', value: formatNumber(ratios.leverage.interestCoverage), color: 'from-orange-500 to-orange-600' },
      ],
    },
    {
      category: 'Valuation',
      metrics: [
        { label: 'P/E Ratio', value: formatNumber(ratios.valuation.peRatio), color: 'from-violet-500 to-violet-600' },
        { label: 'P/B Ratio', value: formatNumber(ratios.valuation.priceToBook), color: 'from-purple-500 to-purple-600' },
        { label: 'EV/EBITDA', value: formatNumber(ratios.valuation.evToEbitda), color: 'from-fuchsia-500 to-fuchsia-600' },
        { label: 'P/S Ratio', value: formatNumber(ratios.valuation.priceToSales), color: 'from-pink-500 to-pink-600' },
      ],
    },
    {
      category: 'Efficiency',
      metrics: [
        { label: 'Asset Turnover', value: formatNumber(ratios.efficiency.assetTurnover), color: 'from-amber-500 to-amber-600' },
        { label: 'Inventory Turnover', value: formatNumber(ratios.efficiency.inventoryTurnover), color: 'from-yellow-500 to-yellow-600' },
        { label: 'Receivables Turnover', value: formatNumber(ratios.efficiency.receivablesTurnover), color: 'from-lime-500 to-lime-600' },
      ],
    },
    {
      category: 'Cash Flow',
      metrics: [
        { label: 'OCF Margin', value: formatPercent(ratios.cashFlow.operatingCashFlowMargin), color: 'from-green-500 to-green-600' },
        { label: 'FCF Yield', value: formatPercent(ratios.cashFlow.freeCashFlowYield), color: 'from-emerald-500 to-emerald-600' },
        { label: 'CF to Debt', value: formatPercent(ratios.cashFlow.cashFlowToDebt), color: 'from-teal-500 to-teal-600' },
      ],
    },
  ]

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Financial Ratios & Metrics
        </h3>

        <div className="mb-8">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Profitability Overview
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={profitabilityData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 'dataMax']}
                tick={{ fill: '#64748b', fontSize: 10 }}
              />
              <Radar
                name="Value"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Legend />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)}%`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          {metricCards.map((category, categoryIndex) => (
            <div key={category.category}>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                {category.category}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.metrics.map((metric, metricIndex) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (categoryIndex * 0.1) + (metricIndex * 0.05) }}
                    className={`p-4 rounded-xl bg-gradient-to-br ${metric.color} text-white shadow-md`}
                  >
                    <p className="text-xs font-medium opacity-90 mb-1">{metric.label}</p>
                    <p className="text-xl font-bold">{metric.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </SlideUp>
  )
}

