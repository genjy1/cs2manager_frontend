import { ref, computed } from 'vue'

/**
 * Composable для валидации форм
 * Применяет KISS - простая и понятная валидация
 *
 * @param {Object} rules - правила валидации
 */
export function useFormValidation(rules = {}) {
  const errors = ref({})
  const touched = ref({})

  /**
   * Валидировать поле
   */
  const validateField = (fieldName, value) => {
    const fieldRules = rules[fieldName]
    if (!fieldRules) return true

    for (const rule of fieldRules) {
      const result = rule.validator(value)
      if (!result) {
        errors.value[fieldName] = rule.message
        return false
      }
    }

    delete errors.value[fieldName]
    return true
  }

  /**
   * Валидировать все поля
   */
  const validateAll = (formData) => {
    let isValid = true

    for (const [fieldName, value] of Object.entries(formData)) {
      const fieldValid = validateField(fieldName, value)
      if (!fieldValid) {
        isValid = false
      }
    }

    return isValid
  }

  /**
   * Пометить поле как "тронутое"
   */
  const touch = (fieldName) => {
    touched.value[fieldName] = true
  }

  /**
   * Очистить ошибки
   */
  const clearErrors = () => {
    errors.value = {}
    touched.value = {}
  }

  /**
   * Получить ошибку для поля
   */
  const getError = (fieldName) => {
    return touched.value[fieldName] ? errors.value[fieldName] : null
  }

  /**
   * Есть ли ошибки
   */
  const hasErrors = computed(() => {
    return Object.keys(errors.value).length > 0
  })

  return {
    errors,
    touched,
    validateField,
    validateAll,
    touch,
    clearErrors,
    getError,
    hasErrors,
  }
}

/**
 * Готовые валидаторы
 */
export const validators = {
  required: (message = 'Поле обязательно для заполнения') => ({
    validator: (value) => {
      if (typeof value === 'string') {
        return value.trim().length > 0
      }
      return value != null && value !== ''
    },
    message,
  }),

  minLength: (length, message) => ({
    validator: (value) => {
      return typeof value === 'string' && value.length >= length
    },
    message: message || `Минимальная длина ${length} символов`,
  }),

  maxLength: (length, message) => ({
    validator: (value) => {
      return typeof value === 'string' && value.length <= length
    },
    message: message || `Максимальная длина ${length} символов`,
  }),

  email: (message = 'Некорректный email') => ({
    validator: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    message,
  }),

  min: (minValue, message) => ({
    validator: (value) => {
      return Number(value) >= minValue
    },
    message: message || `Минимальное значение ${minValue}`,
  }),

  max: (maxValue, message) => ({
    validator: (value) => {
      return Number(value) <= maxValue
    },
    message: message || `Максимальное значение ${maxValue}`,
  }),

  pattern: (regex, message = 'Некорректный формат') => ({
    validator: (value) => {
      return regex.test(value)
    },
    message,
  }),
}
