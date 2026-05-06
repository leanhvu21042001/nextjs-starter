import { TParametersUseMutation, useMutationBase } from '@/hooks/use-mutation-base'

import { authService } from '../auth.service'

export const useLogoutUseCase = (options?: TParametersUseMutation) => {
  return useMutationBase({
    mutationFn: async () => authService.logout(),
    ...options,
  })
}
