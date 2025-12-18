import { ref } from 'vue'
import { toBase64 } from '@/utils/data/toBase64'
import { useToast } from 'vue-toastification'

/**
 * Composable для обработки загрузки файлов
 * Применяет DRY - избегает дублирования логики загрузки файлов
 *
 * @param {Object} options - опции
 * @param {number} options.maxSize - максимальный размер файла в байтах (по умолчанию 5MB)
 * @param {string[]} options.accept - разрешенные типы файлов
 */
export function useFileUpload(options = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    accept = ['image/*'],
  } = options

  const toast = useToast()
  const file = ref(null)
  const filePreview = ref(null)
  const fileInputRef = ref(null)

  /**
   * Валидировать файл
   */
  const validateFile = (selectedFile) => {
    // Проверка типа файла
    const isValidType = accept.some((type) => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0]
        return selectedFile.type.startsWith(category + '/')
      }
      return selectedFile.type === type
    })

    if (!isValidType) {
      toast.error(`Разрешены только файлы типа: ${accept.join(', ')}`)
      return false
    }

    // Проверка размера файла
    if (selectedFile.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1)
      toast.error(`Размер файла не должен превышать ${maxSizeMB}MB`)
      return false
    }

    return true
  }

  /**
   * Обработчик изменения файла
   */
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      file.value = null
      filePreview.value = null
      return
    }

    if (!validateFile(selectedFile)) {
      if (fileInputRef.value) {
        fileInputRef.value.value = ''
      }
      return
    }

    file.value = selectedFile

    // Создаем предпросмотр для изображений
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        filePreview.value = e.target.result
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  /**
   * Конвертировать файл в base64
   */
  const convertToBase64 = async () => {
    if (!file.value) return null

    try {
      const result = await toBase64(file.value)
      return {
        base64: result.base64,
        mime_type: result.mime,
      }
    } catch (error) {
      console.error('Ошибка при конвертации файла:', error)
      toast.error('Не удалось обработать файл')
      throw error
    }
  }

  /**
   * Очистить файл
   */
  const clearFile = () => {
    file.value = null
    filePreview.value = null
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }

  return {
    file,
    filePreview,
    fileInputRef,
    handleFileChange,
    convertToBase64,
    clearFile,
  }
}
