import { ref, nextTick } from 'vue'

/**
 * Composable для управления модальными окнами
 * Применяет DRY - избегает дублирования логики модальных окон
 *
 * @param {Object} options - опции
 * @param {Function} options.onClose - callback при закрытии
 * @param {Function} options.onOpen - callback при открытии
 */
export function useModal(options = {}) {
  const { onClose, onOpen } = options

  const isModalActive = ref(false)
  const modalRef = ref(null)

  /**
   * Открыть модальное окно
   */
  const openModal = async () => {
    isModalActive.value = true
    await nextTick()
    modalRef.value?.focus()

    if (onOpen) {
      onOpen()
    }
  }

  /**
   * Закрыть модальное окно
   */
  const closeModal = () => {
    isModalActive.value = false

    if (onClose) {
      onClose()
    }
  }

  /**
   * Переключить состояние модального окна
   */
  const toggleModal = () => {
    if (isModalActive.value) {
      closeModal()
    } else {
      openModal()
    }
  }

  return {
    isModalActive,
    modalRef,
    openModal,
    closeModal,
    toggleModal,
  }
}
