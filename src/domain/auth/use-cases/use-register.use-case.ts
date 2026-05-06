import { TParametersUseMutation, useMutationBase } from '@/hooks/use-mutation-base'

import { authService } from '../auth.service'
import type { RegisterUiDto } from '../auth.types'

export const useRegisterUseCase = (options?: TParametersUseMutation) => {
  return useMutationBase({
    mutationFn: (payload: unknown) => authService.register(payload as RegisterUiDto),
    ...options,
  })
}
