import type { Locale } from '@/i18n/config'

const settingsPageContent = {
  en: {
    heading: 'Settings',
    subheading: 'System configuration for route /dashboard/settings.',
    accountInfo: {
      title: 'Account information',
      description: 'Update name, date of birth, etc.',
    },
    security: {
      title: 'Security',
      description: 'Change password and configure two-factor authentication (2FA).',
    },
  },
  vi: {
    heading: 'Cài đặt',
    subheading: 'Trang cấu hình hệ thống thuộc route /dashboard/settings.',
    accountInfo: {
      title: 'Thông tin tài khoản',
      description: 'Form cập nhật tên, ngày sinh, v.v...',
    },
    security: {
      title: 'Bảo mật',
      description: 'Đổi mật khẩu và thiết lập 2 bước (2FA).',
    },
  },
} as const

export const getSettingsPageContent = (locale: Locale) => settingsPageContent[locale]
