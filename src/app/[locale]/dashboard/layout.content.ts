import type { Locale } from '@/lib/i18n/config'

const dashboardLayoutContent = {
  en: {
    workspaceLabel: 'Workspace',
    title: 'Dashboard',
    nav: {
      overview: 'Overview',
      users: 'Users',
      settings: 'Settings',
    },
  },
  vi: {
    workspaceLabel: 'Không gian làm việc',
    title: 'Bảng điều khiển',
    nav: {
      overview: 'Tổng quan',
      users: 'Người dùng',
      settings: 'Cài đặt',
    },
  },
} as const

export const getDashboardLayoutContent = (locale: Locale) => dashboardLayoutContent[locale]
