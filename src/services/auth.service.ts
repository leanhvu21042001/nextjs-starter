import { authMapper, registerMapper } from '@/schemas/auth/auth.mapper'
import type { LoginUiDto, RegisterUiDto, AuthModel } from '@/schemas/auth/auth.types'
import Cookies from 'js-cookie'

export const authService = {
  /**
   * Thay vì gọi API thật, hàm này giả lập hành vi login
   * Trong thực tế: thay dòng Fake data bằng fetcher.post('/auth/login')
   */
  async login(uiData: LoginUiDto): Promise<AuthModel> {
    const payload = authMapper.create(uiData)

    // TODO: Replace with real API call
    // const data = await fetcher.post<ApiResponse<unknown>>('/auth/login', payload)

    // -- Fake response --
    await new Promise((resolve) => setTimeout(resolve, 800)) // delay
    if (payload.email !== 'admin@example.com' || payload.password !== '123456') {
      throw new Error('Email hoặc mật khẩu không đúng. Vô Admin: admin@example.com / 123456')
    }
    const fakeApiResponse = {
      accessToken: 'fake-jwt-token-12345',
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: payload.email,
        name: 'Admin User',
      },
    }
    // -------------------

    const authModel = authMapper.fromResponse(fakeApiResponse)

    // Lưu token vào cookie và localStorage
    Cookies.set('token', authModel.accessToken, { expires: 7 })
    localStorage.setItem('access_token', authModel.accessToken)

    return authModel
  },

  /**
   * Đăng ký người dùng
   */
  async register(uiData: RegisterUiDto): Promise<AuthModel> {
    const payload = registerMapper.create(uiData)

    // TODO: Gọi API đăng ký thực tế
    // const data = await fetcher.post<ApiResponse<unknown>>('/auth/register', payload)

    // -- Fake response --
    await new Promise((resolve) => setTimeout(resolve, 800)) // delay
    const fakeApiResponse = {
      accessToken: 'fake-jwt-token-register-12345',
      user: {
        id: '999e4567-e89b-12d3-a456-426614174999',
        email: payload.email,
        name: payload.name,
      },
    }
    // -------------------

    const authModel = registerMapper.fromResponse(fakeApiResponse)

    Cookies.set('token', authModel.accessToken, { expires: 7 })
    localStorage.setItem('access_token', authModel.accessToken)

    return authModel
  },

  logout() {
    Cookies.remove('token')
    localStorage.removeItem('access_token')
    window.location.href = '/login'
  },
}
