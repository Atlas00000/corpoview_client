'use client'

import { useMemo } from 'react'
import useSWR from 'swr'
import apiClient from '@/lib/api/client'
import { StockQuote } from '@/lib/hooks/useStockData'
import { SlideUp, Skeleton } from '@/components/effects'
import StockMoverCard from './StockMoverCard'

const POPULAR_STOCKS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'V', 'JNJ',
  'WMT', 'MA', 'PG', 'UNH', 'HD', 'DIS', 'PYPL', 'BAC', 'CMCSA', 'NFLX',
  'INTC', 'PFE', 'ABBV', 'TMO', 'COST', 'CSCO', 'AVGO', 'PEP', 'ADBE', 'TXN',
]

const STOCK_NAMES: Record<string, string> = {
  AAPL: 'Apple',
  MSFT: 'Microsoft',
  GOOGL: 'Alphabet',
  AMZN: 'Amazon',
  TSLA: 'Tesla',
  META: 'Meta',
  NVDA: 'NVIDIA',
  JPM: 'JPMorgan',
  V: 'Visa',
  JNJ: 'Johnson & Johnson',
  WMT: 'Walmart',
  MA: 'Mastercard',
  PG: 'Procter & Gamble',
  UNH: 'UnitedHealth',
  HD: 'Home Depot',
  DIS: 'Disney',
  PYPL: 'PayPal',
  BAC: 'Bank of America',
  CMCSA: 'Comcast',
  NFLX: 'Netflix',
  INTC: 'Intel',
  PFE: 'Pfizer',
  ABBV: 'AbbVie',
  TMO: 'Thermo Fisher',
  COST: 'Costco',
  CSCO: 'Cisco',
  AVGO: 'Broadcom',
  PEP: 'PepsiCo',
  ADBE: 'Adobe',
  TXN: 'Texas Instruments',
}

export default function StockGainersList() {
  const { data: quotes, isLoading } = useSWR<StockQuote[]>(
    '/api/stocks/batch',
    async () => {
      const responses = await Promise.all(
        POPULAR_STOCKS.slice(0, 30).map((symbol) =>
          apiClient
            .get(`/api/stocks/quote/${symbol}`)
            .then((res) => res.data)
            .catch(() => null)
        )
      )
      return responses.filter((quote): quote is StockQuote => quote !== null)
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  const gainers = useMemo(() => {
    if (!quotes || quotes.length === 0) return []
    return quotes
      .filter((quote) => quote.changePercent !== undefined && quote.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5)
  }, [quotes])

  if (isLoading) {
    return (
      <SlideUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={200} className="rounded-2xl" />
          ))}
        </div>
      </SlideUp>
    )
  }

  if (gainers.length === 0) return null

  return (
    <SlideUp>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {gainers.map((quote, index) => (
          <StockMoverCard
            key={quote.symbol}
            quote={quote}
            rank={index + 1}
            index={index}
            name={STOCK_NAMES[quote.symbol]}
          />
        ))}
      </div>
    </SlideUp>
  )
}

