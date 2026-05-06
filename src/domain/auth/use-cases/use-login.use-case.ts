import { TParametersUseMutation, useMutationBase } from '@/hooks/use-mutation-base'

import { authService } from '../auth.service'
import type { LoginUiDto } from '../auth.types'

export const useLoginUseCase = (options?: TParametersUseMutation) => {
  return useMutationBase({
    mutationFn: (payload: unknown) => authService.login(payload as LoginUiDto),
    ...options,
  })
}
