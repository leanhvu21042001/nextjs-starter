import type { Locale } from '@/lib/i18n/config'

const usersPageContent = {
  en: {
    heading: 'Users',
    subheading: 'User management at route /dashboard/users.',
    placeholder: '(User list table goes here)',
  },
  vi: {
    heading: 'Người dùng',
    subheading: 'Trang quản lý người dùng thuộc route /dashboard/users.',
    placeholder: '(Bảng danh sách người dùng sẽ đặt ở đây)',
  },
} as const

export const getUsersPageContent = (locale: Locale) => usersPageContent[locale]
