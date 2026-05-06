import { TParametersUseMutation, useMutationBase } from '@/hooks/use-mutation-base'

import { authService } from '../auth.service'
import type { AuthModel, RegisterUiDto } from '../auth.types'

export const useRegisterUseCase = (options?: TParametersUseMutation<AuthModel, RegisterUiDto>) => {
  return useMutationBase({
    mutationFn: (payload: RegisterUiDto) => authService.register(payload),
    ...options,
  })
}
