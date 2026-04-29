import {
  type DefaultOptions,
  type MutationCache,
  type QueryCache,
  QueryClient,
} from '@tanstack/react-query'

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: 0,
  },
}

export function createQueryClient(options?: {
  queryCache?: QueryCache
  mutationCache?: MutationCache
}) {
  return new QueryClient({
    defaultOptions,
    queryCache: options?.queryCache,
    mutationCache: options?.mutationCache,
  })
}
