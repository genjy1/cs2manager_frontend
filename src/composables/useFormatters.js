/**
 * Composable для форматирования данных
 */

/**
 * Форматировать рейтинг игрока
 * @param {number|string} rating
 * @returns {string}
 */
export function formatRating(rating) {
  if (!rating && rating !== 0) return '0.00'
  return Number(rating).toFixed(2)
}

/**
 * Форматировать дату
 * @param {string} dateString
 * @param {Object} options - опции форматирования
 * @returns {string}
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return 'Н/Д'

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', defaultOptions)
  } catch (err) {
    console.error('Error formatting date:', err)
    return dateString
  }
}

/**
 * Форматировать размер файла
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function useFormatters() {
  return {
    formatRating,
    formatDate,
    formatFileSize,
  }
}
