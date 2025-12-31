import axios, { AxiosInstance, AxiosError } from 'axios'
import { errorTracking } from '@/lib/tracking/errorTracker'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth tokens or other headers here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Track error
    const errorContext = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
    }

    // Handle network errors
    if (!error.response) {
      const networkError = new Error('Network error. Please check your connection.')
      errorTracking.captureException(networkError, {
        ...errorContext,
        originalError: error.message,
        networkError: true,
      })
      throw networkError
    }

    // Handle HTTP errors
    const status = error.response.status
    const message = (error.response.data as any)?.error || error.message

    // Track 5xx server errors and unexpected errors
    if (status >= 500) {
      errorTracking.captureException(new Error(`API Error ${status}: ${message}`), {
        ...errorContext,
        apiError: true,
      })
    }

    switch (status) {
      case 401:
        throw new Error('Unauthorized. Please log in again.')
      case 403:
        throw new Error('Access forbidden.')
      case 404:
        throw new Error('Resource not found.')
      case 500:
        throw new Error('Server error. Please try again later.')
      default:
        throw new Error(message || 'An error occurred.')
    }
  }
)

export default apiClient

