import { computed } from 'vue'
import {
  PLAYER_STATUS_LABELS,
  PLAYER_STATUS_LABELS_SHORT,
  PLAYER_STATUS_CLASSES,
} from '@/constants/playerStatus'

/**
 * Composable для работы со статусами игроков
 * @param {Ref|ComputedRef} status - реактивная ссылка на статус игрока
 * @param {Object} options - опции
 * @param {boolean} options.useShortLabel - использовать короткую метку
 */
export function usePlayerStatus(status, options = {}) {
  const { useShortLabel = false } = options

  /**
   * Получить CSS классы для статуса
   */
  const statusClass = computed(() => {
    const statusValue = typeof status === 'function' ? status() : status?.value
    return (
      PLAYER_STATUS_CLASSES[statusValue] || 'bg-gray-500/90 text-white border border-gray-400'
    )
  })

  /**
   * Получить текстовую метку статуса
   */
  const statusLabel = computed(() => {
    const statusValue = typeof status === 'function' ? status() : status?.value
    const labels = useShortLabel ? PLAYER_STATUS_LABELS_SHORT : PLAYER_STATUS_LABELS
    return labels[statusValue] || statusValue?.toUpperCase() || 'Н/Д'
  })

  return {
    statusClass,
    statusLabel,
  }
}
