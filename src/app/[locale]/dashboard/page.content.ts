import type { Locale } from '@/lib/i18n/config'

const dashboardPageContent = {
  en: {
    heading: 'Data Grid CRUD Full Example',
    description:
      'This dashboard demonstrates the complete toolbar workflow: add/update (modal), multi-select delete, save mutations, refresh with params, per-item success/error mapping, retry one/selected/all failed items, and batch mutation handling with concurrency controls.',
  },
  vi: {
    heading: 'Ví dụ CRUD Data Grid đầy đủ',
    description:
      'Dashboard này minh họa toàn bộ luồng thao tác trên toolbar: thêm/cập nhật (modal), xóa nhiều bản ghi, lưu mutation, làm mới kèm tham số, ánh xạ thành công/lỗi theo từng bản ghi, thử lại 1/một nhóm/toàn bộ bản ghi thất bại, và xử lý mutation theo lô có kiểm soát đồng thời.',
  },
} as const

export const getDashboardPageContent = (locale: Locale) => dashboardPageContent[locale]
