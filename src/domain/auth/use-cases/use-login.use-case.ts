import { TParametersUseMutation, useMutationBase } from '@/hooks/use-mutation-base'

import { authService } from '../auth.service'
import type { AuthModel, LoginUiDto } from '../auth.types'

export const useLoginUseCase = (options?: TParametersUseMutation<AuthModel, LoginUiDto>) => {
  return useMutationBase({
    mutationFn: (payload: LoginUiDto) => authService.login(payload),
    ...options,
  })
}
