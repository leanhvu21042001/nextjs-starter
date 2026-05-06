import { useMutation } from '@tanstack/react-query'

type TOptionsUseMutationBase = Parameters<typeof useMutation>[0]
export type TParametersUseMutation = Parameters<typeof useMutation>[0]

export const useMutationBase = (options: TOptionsUseMutationBase) => {
  return useMutation({
    mutationFn: options.mutationFn,
    ...options,
  })
}
