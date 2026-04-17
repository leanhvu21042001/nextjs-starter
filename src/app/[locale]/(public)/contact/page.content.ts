import type { Locale } from '@/lib/i18n/config'

const contactPageContent = {
  en: {
    meta: {
      title: 'Contact',
      description:
        'Contact the N-Starter Team for DataGrid integration and Clean Architecture support.',
    },
    heading: 'Contact',
    subheading: 'An example Form reusing Atoms (Input, Label, Button) in a public page.',
    form: {
      firstName: 'First name',
      firstNamePlaceholder: 'Doe',
      lastName: 'Last name',
      lastNamePlaceholder: 'John',
      email: 'Email',
      message: 'Message',
      messagePlaceholder: 'How can we help?',
      submit: 'Send',
    },
  },
  vi: {
    meta: {
      title: 'Liên hệ',
      description:
        'Liên hệ với N-Starter Team để nhận hỗ trợ tích hợp DataGrid và Clean Architecture.',
    },
    heading: 'Liên hệ',
    subheading: 'Một ví dụ về Form sử dụng lại các Atom (Input, Label, Button) trong public page.',
    form: {
      firstName: 'Họ',
      firstNamePlaceholder: 'Nguyễn',
      lastName: 'Tên',
      lastNamePlaceholder: 'Van A',
      email: 'Email',
      message: 'Nội dung',
      messagePlaceholder: 'Bạn cần hỗ trợ gì?',
      submit: 'Gửi đi',
    },
  },
} as const

export const getContactPageContent = (locale: Locale) => contactPageContent[locale]
