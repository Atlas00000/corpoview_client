import useSWR from 'swr'
import apiClient from '../api/client'

export interface StockQuote {
  symbol: string
  price: number
  open: number
  high: number
  low: number
  volume: number
  latestTradingDay: string
  previousClose: number
  change: number
  changePercent: number
}

export interface StockDataPoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface CompanyOverview {
  Symbol: string
  Name: string
  Description: string
  Sector: string
  Industry: string
  MarketCapitalization: string
  PayoutRatio: string
  DividendYield: string
  EPS: string
  PERatio: string
  [key: string]: any
}

/**
 * Hook to fetch stock quote
 */
export function useStockQuote(symbol: string | null) {
  const { data, error, isLoading, mutate } = useSWR<StockQuote>(
    symbol ? `/api/stocks/quote/${symbol}` : null,
    async (url: string) => {
      const response = await apiClient.get(url)
      return response.data
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  )

  return {
    quote: data,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook to fetch intraday stock data
 */
export function useStockIntraday(symbol: string | null, interval: string = '5min') {
  const { data, error, isLoading, mutate } = useSWR<StockDataPoint[]>(
    symbol ? `/api/stocks/intraday/${symbol}?interval=${interval}` : null,
    async (url: string) => {
      const response = await apiClient.get(url)
      return response.data
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  )

  return {
    data: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook to fetch daily stock data
 */
export function useStockDaily(symbol: string | null, outputsize: 'compact' | 'full' = 'compact') {
  const { data, error, isLoading, mutate } = useSWR<StockDataPoint[]>(
    symbol ? `/api/stocks/daily/${symbol}?outputsize=${outputsize}` : null,
    async (url: string) => {
      const response = await apiClient.get(url)
      return response.data
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 hour
    }
  )

  return {
    data: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook to fetch company overview
 */
export function useCompanyOverview(symbol: string | null) {
  const { data, error, isLoading, mutate } = useSWR<CompanyOverview>(
    symbol ? `/api/stocks/overview/${symbol}` : null,
    async (url: string) => {
      const response = await apiClient.get(url)
      return response.data
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 86400000, // 24 hours
    }
  )

  return {
    overview: data,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook to fetch company profile
 */
export function useCompanyProfile(symbol: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    symbol ? `/api/stocks/profile/${symbol}` : null,
    async (url: string) => {
      const response = await apiClient.get(url)
      return response.data
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 86400000, // 24 hours
    }
  )

  return {
    profile: data,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook to fetch financial statements
 */
export function useFinancialStatements(symbol: string | null, limit: number = 5) {
  const { data, error, isLoading, mutate } = useSWR(
    symbol ? `/api/stocks/financials/${symbol}?limit=${limit}` : null,
    async (url: string) => {
      const response = await apiClient.get(url)
      return response.data
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 86400000, // 24 hours
    }
  )

  return {
    financials: data,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook to fetch stock news
 */
export function useStockNews(symbol: string | null, limit: number = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    symbol ? `/api/stocks/news/${symbol}?limit=${limit}` : null,
    async (url: string) => {
      const response = await apiClient.get(url)
      return response.data
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 900000, // 15 minutes
    }
  )

  return {
    news: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook to fetch earnings calendar
 */
export function useEarningsCalendar(from?: string, to?: string) {
  const fromDate = from || new Date().toISOString().split('T')[0]
  const toDate = to || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  const { data, error, isLoading, mutate } = useSWR(
    `/api/stocks/earnings-calendar?from=${fromDate}&to=${toDate}`,
    async (url: string) => {
      const response = await apiClient.get(url)
      return response.data
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 hour
    }
  )

  return {
    calendar: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

