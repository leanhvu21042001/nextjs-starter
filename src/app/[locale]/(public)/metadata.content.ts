import type { Locale } from '@/i18n/config'

const metadataContent = {
  en: {
    title: 'Next.js Starter',
    description:
      'Multilingual Next.js starter with clean architecture, reusable components, and dashboard-ready building blocks.',
  },
  vi: {
    title: 'Next.js Starter',
    description:
      'Bộ khởi tạo Next.js đa ngôn ngữ với clean architecture, component tái sử dụng và nền tảng dashboard.',
  },
} as const

export const getMetadataContent = (locale: Locale) => metadataContent[locale]
