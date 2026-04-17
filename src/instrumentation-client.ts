import { logger } from '@/lib/logger'

try {
  logger.info('Client instrumentation initialized')

  window.addEventListener('error', (event) => {
    logger.error('Unhandled browser error', event.error ?? { message: event.message })
  })

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', {
      reason: event.reason,
    })
  })
} catch (error) {
  logger.error('Client instrumentation failed to initialize', error as Error)
}

export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse',
) {
  logger.debug('Router transition started', {
    url,
    navigationType,
  })
}
