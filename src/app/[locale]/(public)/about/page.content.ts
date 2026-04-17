import type { Locale } from '@/i18n/config'

const aboutPageContent = {
  en: {
    meta: {
      title: 'About Us',
      description:
        'Learn about our mission and how we build robust Atomic Design architecture with Next.js.',
    },
    eyebrow: 'About us',
    heading: 'Atomic Design & the Power of Next.js',
    body: 'This page is rendered by the Public Layout without being constrained by the left sidebar of the Dashboard. Every route inside the (public) group can easily reuse this layout.',
    backHome: '<- Back to home',
  },
  vi: {
    meta: {
      title: 'Giới thiệu về chúng tôi',
      description:
        'Tìm hiểu về sứ mệnh và cách chúng tôi xây dựng kiến trúc Atomic Design mạnh mẽ với Next.js.',
    },
    eyebrow: 'Về chúng tôi',
    heading: 'Atomic Design & Sức mạnh của Next.js',
    body: 'Trang này được render bởi Public Layout mà không bị ràng buộc bởi thanh menu bên trái của Dashboard. Mọi route nằm trong nhóm (public) đều dễ dàng sử dụng lại layout này.',
    backHome: '<- Quay lại trang chủ',
  },
} as const

export const getAboutPageContent = (locale: Locale) => aboutPageContent[locale]
