import type { Locale } from '@/lib/i18n/config'

const pageContent = {
  en: {
    meta: {
      title: 'Modern Next.js Starter',
      description:
        'A multilingual Next.js starter with clean architecture, reusable UI, and practical dashboard workflows.',
    },
    hero: {
      title: 'Build faster with a production-ready Next.js starter',
      description:
        'Use typed forms, reusable components, and locale-aware routing to ship features confidently.',
      primaryCta: 'Sign in',
      secondaryCta: 'Explore dashboard',
    },
  },
  vi: {
    meta: {
      title: 'Next.js Starter hiện đại',
      description:
        'Bộ khởi tạo Next.js đa ngôn ngữ với clean architecture, UI tái sử dụng và luồng dashboard thực tế.',
    },
    hero: {
      title: 'Xây dựng nhanh hơn với Next.js Starter sẵn sàng cho production',
      description:
        'Sử dụng form có type, component tái sử dụng và định tuyến theo ngôn ngữ để phát triển tính năng ổn định.',
      primaryCta: 'Đăng nhập',
      secondaryCta: 'Vào dashboard',
    },
  },
} as const

export const getPublicPageContent = (locale: Locale) => pageContent[locale]
