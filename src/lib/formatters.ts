import { format } from 'date-fns'

import { configs } from './configs'

const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return value
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date
    }
  }
  return null
}

const toDateTimeString = (date: Date, type: 'date' | 'time' | 'datetime'): string => {
  switch (type) {
    case 'date':
      return format(date, configs.DATE_FORMAT)
    case 'time':
      return format(date, configs.TIME_FORMAT)
    case 'datetime':
      return format(date, configs.DATE_TIME_FORMAT)
    default:
      throw new Error(`unsupported type: "${type}"`)
  }
}

export const formatters = {
  date: {
    toDate,
    toDateTimeString,
  },
}
