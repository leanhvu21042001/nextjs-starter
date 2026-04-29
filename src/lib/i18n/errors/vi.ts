import { ERROR_CODES } from '@/domain/error'

export const viErrorMessages: Record<string, string> = {
  [ERROR_CODES.VALIDATION_REQUIRED]: 'Trường này là bắt buộc.',
  [ERROR_CODES.VALIDATION_INVALID_EMAIL]: 'Email không đúng định dạng.',
  [ERROR_CODES.VALIDATION_MIN_LENGTH]: 'Giá trị ngắn hơn độ dài cho phép.',
  [ERROR_CODES.VALIDATION_MAX_LENGTH]: 'Giá trị vượt quá độ dài cho phép.',
  [ERROR_CODES.VALIDATION_INVALID_FORMAT]: 'Giá trị không đúng định dạng.',
  [ERROR_CODES.VALIDATION_INVALID_ENUM]: 'Giá trị đã chọn không hợp lệ.',
  [ERROR_CODES.VALIDATION_PASSWORD_MIN_LENGTH]: 'Mật khẩu phải có ít nhất 6 ký tự.',
  [ERROR_CODES.VALIDATION_PASSWORD_MISMATCH]: 'Mật khẩu xác nhận không khớp.',
  [ERROR_CODES.VALIDATION_INVALID_INPUT]: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',

  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Email hoặc mật khẩu không đúng.',

  [ERROR_CODES.NET_BAD_REQUEST]: 'Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra lại.',
  [ERROR_CODES.NET_TIMEOUT]: 'Yêu cầu bị quá thời gian. Vui lòng thử lại.',
  [ERROR_CODES.NET_UNAUTHORIZED]: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  [ERROR_CODES.NET_FORBIDDEN]: 'Bạn không có quyền thực hiện thao tác này.',
  [ERROR_CODES.NET_NOT_FOUND]: 'Không tìm thấy {resource} (ID: {id}).',
  [ERROR_CODES.NET_CONFLICT]: 'Dữ liệu {resource} (ID: {id}) đang bị xung đột.',
  [ERROR_CODES.NET_PAYLOAD_TOO_LARGE]: 'Dung lượng dữ liệu gửi lên quá lớn.',
  [ERROR_CODES.NET_SERVER_ERROR]: 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.',

  [ERROR_CODES.BUSINESS_CONFLICT]: 'Không thể thực hiện thao tác: {reason}.',

  [ERROR_CODES.SYS_UNEXPECTED]: 'Có lỗi hệ thống xảy ra. Vui lòng thử lại.',
}
