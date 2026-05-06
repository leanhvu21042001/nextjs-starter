import {
  type DefaultError,
  type QueryKey,
  type UseQueryOptions,
  useQuery,
} from '@tanstack/react-query'

export type TParametersUseQuery<
  TQueryFnData,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TError = DefaultError,
> = Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>

export const useQueryBase = <
  TQueryFnData,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TError = DefaultError,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) => {
  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    staleTime: 1000 * 60 * 5, // Dữ liệu được coi là "mới" trong 5 phút
    refetchOnWindowFocus: false, // Không tự động refetch khi cửa sổ được focus lại
    refetchInterval: false, // Không tự động refetch theo khoảng thời gian
    refetchIntervalInBackground: false, // Không refetch khi app ở background
    // refetchOnMount: false, // Không tự động refetch khi component mount lại
    // refetchOnReconnect: false, // Không tự động refetch khi kết nối mạng được khôi phục
    ...options, // Cho phép ghi đè hoặc bổ sung options từ component
  })
}
