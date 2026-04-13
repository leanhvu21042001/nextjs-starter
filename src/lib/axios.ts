import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// ─── Axios Instance ────────────────────────────────────────────────────────────

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ─── Request Interceptor ──────────────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach Bearer token if available (e.g. from localStorage / cookie)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

// ─── Response Interceptor ─────────────────────────────────────────────────────

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized — redirect to login or clear token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        // window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
