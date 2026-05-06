import { type DefaultError, type UseMutationOptions, useMutation } from '@tanstack/react-query'

export type TParametersUseMutation<
  TData,
  TVariables = void,
  TError = DefaultError,
  TContext = unknown,
> = Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>

export const useMutationBase = <
  TData,
  TVariables = void,
  TError = DefaultError,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
) => {
  return useMutation<TData, TError, TVariables, TContext>(options)
}
