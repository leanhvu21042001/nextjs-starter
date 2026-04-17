import type { Locale } from '@/lib/i18n/config'

const publicLayoutContent = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
    },
    login: 'Sign in',
    register: 'Join now',
    footer: 'Built with Atomic Design structure.',
  },
  vi: {
    nav: {
      home: 'Trang chủ',
      about: 'Giới thiệu',
      contact: 'Liên hệ',
    },
    login: 'Đăng nhập',
    register: 'Tham gia ngay',
    footer: 'Xây dựng cấu trúc Atomic Design.',
  },
} as const

export const getPublicLayoutContent = (locale: Locale) => publicLayoutContent[locale]
