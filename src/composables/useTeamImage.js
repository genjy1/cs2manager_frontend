import { computed } from 'vue'

/**
 * Composable для работы с изображениями команд (логотипы)
 * @param {Ref} team - реактивная ссылка на объект команды
 */
export function useTeamImage(team) {
  /**
   * Получить URL логотипа команды из base64
   */
  const teamLogo = computed(() => {
    if (!team.value?.images || !Array.isArray(team.value.images) || team.value.images.length === 0) {
      return null
    }

    const firstImage = team.value.images[0]
    if (!firstImage?.base64) {
      return null
    }

    const mimeType = firstImage.mime_type || 'image/png'
    return `data:${mimeType};base64,${firstImage.base64}`
  })

  /**
   * Получить инициалы команды для placeholder
   */
  const teamInitials = computed(() => {
    if (!team.value?.name) return '?'

    const words = team.value.name.trim().split(/\s+/)
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
    }
    return team.value.name.substring(0, 2).toUpperCase()
  })

  /**
   * Получить отображаемое имя команды
   */
  const teamDisplayName = computed(() => {
    if (!team.value) return ''
    return team.value.name || 'Без названия'
  })

  /**
   * Получить краткое название команды (тег)
   */
  const teamTag = computed(() => {
    if (!team.value?.tag) return teamInitials.value
    return team.value.tag.toUpperCase()
  })

  /**
   * Обработчик ошибки загрузки изображения
   */
  const handleImageError = (event) => {
    console.error('Ошибка загрузки логотипа команды:', event.target?.src)
    if (event.target) {
      event.target.style.display = 'none'
    }
  }

  return {
    teamLogo,
    teamInitials,
    teamDisplayName,
    teamTag,
    handleImageError,
  }
}
