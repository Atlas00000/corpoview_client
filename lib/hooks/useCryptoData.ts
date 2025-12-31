import useSWR from 'swr'
import apiClient from '../api/client'

export interface CryptoMarketData {
  id: string
  symbol: string
  name: string
  image: string
  currentPrice: number
  marketCap: number
  marketCapRank: number
  totalVolume: number
  high24h: number
  low24h: number
  priceChange24h: number
  priceChangePercentage24h: number
  [key: string]: any
}

export interface CryptoPriceData {
  [coinId: string]: {
    [currency: string]: number | undefined
    usd_market_cap?: number
    usd_24h_vol?: number
    usd_24h_change?: number
  }
}

export interface CryptoHistoricalDataPoint {
  date: string
  price: number
  marketCap?: number
  volume?: number
}

export interface GlobalCryptoData {
  totalMarketCap: number
  totalVolume: number
  marketCapPercentage: Record<string, number>
  marketCapChangePercentage24hUsd: number
  activeCryptocurrencies: number
  markets: number
}

/**
 * Hook to fetch cryptocurrency market data
 */
export function useCryptoMarkets(
  vsCurrency: string = 'usd',
  ids?: string[],
  limit: number = 100
) {
  const { data, error, isLoading, mutate } = useSWR<CryptoMarketData[]>(
    `/api/crypto/markets?vs_currency=${vsCurrency}&limit=${limit}${ids ? `&ids=${ids.join(',')}` : ''}`,
    async (url: string) => {
      const response = await apiClient.get(url)
      return response.data
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 120000, // 2 minutes
    }
  )

  return {
    markets: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook to fetch cryptocurrency price data
 */
export function useCryptoPrice(ids: string | string[], vsCurrencies: string | string[] = 'usd') {
  const idArray = Array.isArray(ids) ? ids : [ids]
  const { data, error, isLoading, mutate } = useSWR<CryptoPriceData>(
    `/api/crypto/price/${idArray.join(',')}?vs_currencies=${Array.isArray(vsCurrencies) ? vsCurrencies.join(',') : vsCurrencies}`,
    async (url: string) => {
      const response = await apiClient.get(url)
      return response.data
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 120000, // 2 minutes
    }
  )

  return {
    prices: data,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook to fetch cryptocurrency historical data
 */
export function useCryptoHistory(id: string | null, vsCurrency: string = 'usd', days: number = 30) {
  const { data, error, isLoading, mutate } = useSWR<CryptoHistoricalDataPoint[]>(
    id ? `/api/crypto/history/${id}?vs_currency=${vsCurrency}&days=${days}` : null,
    async (url: string) => {
      const response = await apiClient.get(url)
      return response.data
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  )

  return {
    history: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook to fetch global cryptocurrency market data
 */
export function useGlobalCryptoData() {
  const { data, error, isLoading, mutate } = useSWR<GlobalCryptoData>(
    '/api/crypto/global',
    async (url: string) => {
      const response = await apiClient.get(url)
      return response.data
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  )

  return {
    global: data,
    isLoading,
    isError: error,
    mutate,
  }
}

