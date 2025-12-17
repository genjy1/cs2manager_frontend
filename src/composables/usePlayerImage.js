import { computed } from 'vue'

/**
 * Composable для работы с изображениями игроков
 * @param {Ref} player - реактивная ссылка на объект игрока
 */
export function usePlayerImage(player) {
  /**
   * Получить URL аватара игрока из base64
   */
  const playerAvatar = computed(() => {
    if (
      !player.value?.images ||
      !Array.isArray(player.value.images) ||
      player.value.images.length === 0
    ) {
      return null
    }

    const firstImage = player.value.images[0]
    if (!firstImage?.base64) {
      return null
    }

    const mimeType = firstImage.mime_type || 'image/jpeg'
    return `data:${mimeType};base64,${firstImage.base64}`
  })

  /**
   * Получить инициалы игрока для placeholder
   */
  const playerInitials = computed(() => {
    if (!player.value) return '?'

    if (player.value.nickname) {
      return player.value.nickname.substring(0, 2).toUpperCase()
    }

    const firstName = player.value.name?.charAt(0) || ''
    const lastName = player.value.surname?.charAt(0) || ''
    return (firstName + lastName).toUpperCase() || '?'
  })

  /**
   * Получить полное имя игрока
   */
  const playerFullName = computed(() => {
    if (!player.value) return ''

    if (player.value.nickname) {
      return player.value.nickname
    }

    return `${player.value.name || ''} ${player.value.surname || ''}`.trim()
  })

  /**
   * Получить отображаемое имя игрока (никнейм или полное имя)
   */
  const playerDisplayName = computed(() => {
    if (!player.value) return ''
    return player.value.nickname || `${player.value.name} ${player.value.surname}`
  })

  /**
   * Обработчик ошибки загрузки изображения
   */
  const handleImageError = (event) => {
    console.error('Ошибка загрузки изображения:', event.target?.src)
    if (event.target) {
      event.target.style.display = 'none'
    }
  }

  return {
    playerAvatar,
    playerInitials,
    playerFullName,
    playerDisplayName,
    handleImageError,
  }
}
