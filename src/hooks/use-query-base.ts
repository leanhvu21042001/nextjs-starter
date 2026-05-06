import { useQuery, useQueryClient } from '@tanstack/react-query'

export type TOptionsUseQuery = Omit<Parameters<typeof useQuery>[0], 'queryKey' | 'queryFn'>
export const useQueryBase = ({
  queryKey,
  queryFn,
  options = {},
}: {
  queryKey: Parameters<typeof useQuery>[0]['queryKey']
  queryFn: Parameters<typeof useQuery>[0]['queryFn']
  options?: TOptionsUseQuery
}) => {
  const queryClient = useQueryClient()
  return useQuery(
    {
      queryKey, // Key dùng để định danh dữ liệu trong cache
      queryFn, // Hàm lấy dữ liệu
      staleTime: 1000 * 60 * 5, // Dữ liệu được coi là "mới" trong 5 phút
      refetchOnWindowFocus: false, // Không tự động refetch khi cửa sổ được focus lại
      refetchInterval: false, // Không tự động refetch theo khoảng thời gian
      refetchIntervalInBackground: false, // Không refetch khi app ở background
      // refetchOnMount: false, // Không tự động refetch khi component mount lại
      // refetchOnReconnect: false, // Không tự động refetch khi kết nối mạng được khôi phục
      ...options, // Cho phép ghi đè hoặc bổ sung options từ component
    },
    queryClient,
  )
}
