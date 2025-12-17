/**
 * Конвертирует File в base64 строку
 * @param {File} file - файл для конвертации
 * @returns {Promise<{base64: string, mime: string}>}
 */
export const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // Валидация входных данных
    if (!(file instanceof File)) {
      reject(new Error('Переданный параметр не является файлом'))
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result

      // result имеет формат: "data:image/png;base64,iVBORw0KGgo..."
      // Нужно извлечь только base64 часть
      const base64String = result.split(',')[1]

      resolve({
        base64: base64String,
        mime: file.type,
      })
    }

    reader.onerror = (error) => {
      reject(new Error(`Ошибка чтения файла: ${error}`))
    }

    reader.readAsDataURL(file)
  })
}
