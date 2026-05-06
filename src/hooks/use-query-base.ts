import { useQuery } from '@tanstack/react-query'

type TOptionsUseQueryBase = Parameters<typeof useQuery>[0]
export type TParametersUseQuery = Omit<Parameters<typeof useQuery>[0], 'queryKey'>

export const useQueryBase = (options: TOptionsUseQueryBase) => {
  return useQuery({
    staleTime: 1000 * 60 * 5, // Dữ liệu được coi là "mới" trong 5 phút
    refetchOnWindowFocus: false, // Không tự động refetch khi cửa sổ được focus lại
    refetchInterval: false, // Không tự động refetch theo khoảng thời gian
    refetchIntervalInBackground: false, // Không refetch khi app ở background
    // refetchOnMount: false, // Không tự động refetch khi component mount lại
    // refetchOnReconnect: false, // Không tự động refetch khi kết nối mạng được khôi phục
    ...options, // Cho phép ghi đè hoặc bổ sung options từ component
  })
}
