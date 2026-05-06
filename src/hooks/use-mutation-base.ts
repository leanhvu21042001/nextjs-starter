import { useMutation, useQueryClient } from '@tanstack/react-query'

export type TOptionsUseMutation = Omit<Parameters<typeof useMutation>[0], 'mutationFn'>

export const useMutationBase = ({
  mutationFn,
  options = {},
}: {
  mutationFn: Parameters<typeof useMutation>[0]['mutationFn']
  options?: TOptionsUseMutation
}) => {
  const queryClient = useQueryClient()
  return useMutation(
    {
      mutationFn,
      ...options,
    },
    queryClient,
  )
}
