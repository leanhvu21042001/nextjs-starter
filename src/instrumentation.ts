import { logger } from '@/lib/logger'

export async function register() {
  logger.info('Server instrumentation initialized', {
    runtime: process.env.NEXT_RUNTIME ?? 'nodejs',
  })
}
