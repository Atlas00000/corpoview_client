import useSWR from 'swr'
import apiClient from '../api/client'

export interface ExchangeRates {
  base: string
  date: string
  rates: Record<string, number>
}

export interface CurrencyConversion {
  from: string
  to: string
  amount: number
  converted: number
  rate: number
  date: string
}

/**
 * Hook to fetch latest exchange rates
 */
export function useLatestRates(base: string = 'USD') {
  const { data, error, isLoading, mutate } = useSWR<ExchangeRates>(
    `/api/fx/latest?base=${base}`,
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
    rates: data,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook to convert currency
 */
export function useCurrencyConversion(
  amount: number | null,
  from: string | null,
  to: string | null
) {
  const { data, error, isLoading, mutate } = useSWR<CurrencyConversion>(
    amount && from && to ? `/api/fx/convert?amount=${amount}&from=${from}&to=${to}` : null,
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
    conversion: data,
    isLoading,
    isError: error,
    mutate,
  }
}

