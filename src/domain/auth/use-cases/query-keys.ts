export const authQueryKeys = {
  login: () => ['auth.login'] as const,
  register: () => ['auth.register'] as const,
  logout: () => ['auth.logout'] as const,
}
