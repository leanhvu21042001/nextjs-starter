import { ERROR_CODES } from '@/domain/error'

export const enErrorMessages: Record<string, string> = {
  [ERROR_CODES.VALIDATION_REQUIRED]: 'This field is required.',
  [ERROR_CODES.VALIDATION_INVALID_EMAIL]: 'Email format is invalid.',
  [ERROR_CODES.VALIDATION_MIN_LENGTH]: 'Value is shorter than allowed.',
  [ERROR_CODES.VALIDATION_MAX_LENGTH]: 'Value is longer than allowed.',
  [ERROR_CODES.VALIDATION_INVALID_FORMAT]: 'Value format is invalid.',
  [ERROR_CODES.VALIDATION_INVALID_ENUM]: 'Selected value is invalid.',
  [ERROR_CODES.VALIDATION_PASSWORD_MIN_LENGTH]: 'Password must be at least 6 characters.',
  [ERROR_CODES.VALIDATION_PASSWORD_MISMATCH]: 'Password confirmation does not match.',
  [ERROR_CODES.VALIDATION_INVALID_INPUT]: 'Your input is invalid. Please review and try again.',

  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password.',

  [ERROR_CODES.NET_BAD_REQUEST]: 'Request data is invalid. Please check and try again.',
  [ERROR_CODES.NET_TIMEOUT]: 'Request timed out. Please try again.',
  [ERROR_CODES.NET_UNAUTHORIZED]: 'Your session has expired. Please sign in again.',
  [ERROR_CODES.NET_FORBIDDEN]: 'You do not have permission to perform this action.',
  [ERROR_CODES.NET_NOT_FOUND]: 'Resource {resource} (ID: {id}) was not found.',
  [ERROR_CODES.NET_CONFLICT]: 'Conflict on {resource} (ID: {id}).',
  [ERROR_CODES.NET_PAYLOAD_TOO_LARGE]: 'Request payload is too large.',
  [ERROR_CODES.NET_SERVER_ERROR]: 'Server is currently unavailable. Please try again later.',

  [ERROR_CODES.BUSINESS_CONFLICT]: 'Operation is blocked: {reason}.',

  [ERROR_CODES.SYS_UNEXPECTED]: 'An unexpected error occurred. Please try again.',
}
