import { useMutation } from '@tanstack/react-query'

import { authService } from './auth.service'
import type { LoginUiDto, RegisterUiDto } from './auth.types'

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginUiDto) => authService.login(payload),
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterUiDto) => authService.register(payload),
  })
}
