import useSWR from 'swr'
import apiClient from '../api/client'

export interface NewsArticle {
  source: string
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

/**
 * Hook to fetch top headlines
 */
export function useTopHeadlines(
  category?: string,
  country: string = 'us',
  pageSize: number = 20
) {
  const { data, error, isLoading, mutate } = useSWR<NewsArticle[]>(
    `/api/news/headlines?country=${country}&pageSize=${pageSize}${category ? `&category=${category}` : ''}`,
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
    articles: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook to search news
 */
export function useNewsSearch(
  query: string | null,
  language: string = 'en',
  sortBy: string = 'publishedAt',
  pageSize: number = 20
) {
  const { data, error, isLoading, mutate } = useSWR<NewsArticle[]>(
    query ? `/api/news/search?q=${encodeURIComponent(query)}&language=${language}&sortBy=${sortBy}&pageSize=${pageSize}` : null,
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
    articles: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook to fetch business news
 */
export function useBusinessNews(pageSize: number = 20) {
  const { data, error, isLoading, mutate } = useSWR<NewsArticle[]>(
    `/api/news/business?pageSize=${pageSize}`,
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
    articles: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

