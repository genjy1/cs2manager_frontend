import { useToast } from 'vue-toastification'

/**
 * Error Handler Service
 * Применяет Single Responsibility Principle - только обработка ошибок
 */

class ErrorHandler {
  constructor() {
    this.toast = null
  }

  /**
   * Инициализировать toast (вызывается в setup)
   */
  initToast() {
    if (!this.toast) {
      this.toast = useToast()
    }
  }

  /**
   * Обработать API ошибку
   */
  handleApiError(error, options = {}) {
    const {
      showToast = true,
      defaultMessage = 'Произошла ошибка',
      onError,
    } = options

    console.error('API Error:', error)

    const errorMessage = this.extractErrorMessage(error, defaultMessage)

    if (showToast && this.toast) {
      this.toast.error(errorMessage)
    }

    if (onError) {
      onError(error, errorMessage)
    }

    return errorMessage
  }

  /**
   * Извлечь сообщение об ошибке из объекта ошибки
   */
  extractErrorMessage(error, defaultMessage) {
    // Попробуем извлечь сообщение из разных мест
    if (error.data?.message) {
      return error.data.message
    }

    if (error.message) {
      return error.message
    }

    if (error.statusText) {
      return error.statusText
    }

    if (typeof error === 'string') {
      return error
    }

    return defaultMessage
  }

  /**
   * Обработать ошибку валидации
   */
  handleValidationError(errors, options = {}) {
    const { showToast = true } = options

    if (showToast && this.toast) {
      const errorMessages = Object.values(errors).filter(Boolean)
      if (errorMessages.length > 0) {
        this.toast.error(errorMessages[0])
      }
    }
  }

  /**
   * Обработать успешную операцию
   */
  handleSuccess(message, options = {}) {
    const { showToast = true } = options

    if (showToast && this.toast) {
      this.toast.success(message)
    }
  }

  /**
   * Обработать предупреждение
   */
  handleWarning(message, options = {}) {
    const { showToast = true } = options

    if (showToast && this.toast) {
      this.toast.warning(message)
    }
  }

  /**
   * Обработать информационное сообщение
   */
  handleInfo(message, options = {}) {
    const { showToast = true } = options

    if (showToast && this.toast) {
      this.toast.info(message)
    }
  }
}

// Singleton
export const errorHandler = new ErrorHandler()

/**
 * Composable для использования error handler в компонентах
 */
export function useErrorHandler() {
  errorHandler.initToast()
  return errorHandler
}
