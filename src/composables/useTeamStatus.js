import { computed } from 'vue'
import { TEAM_STATUS_LABELS, TEAM_STATUS_CLASSES } from '@/constants/teamConstants'

/**
 * Composable для работы со статусами команд
 * @param {Ref|ComputedRef} status - реактивная ссылка на статус команды
 */
export function useTeamStatus(status) {
  /**
   * Получить CSS классы для статуса команды
   */
  const statusClass = computed(() => {
    const statusValue = typeof status === 'function' ? status() : status?.value
    return (
      TEAM_STATUS_CLASSES[statusValue] || 'bg-gray-500/90 text-white border border-gray-400'
    )
  })

  /**
   * Получить текстовую метку статуса команды
   */
  const statusLabel = computed(() => {
    const statusValue = typeof status === 'function' ? status() : status?.value
    return TEAM_STATUS_LABELS[statusValue] || statusValue?.toUpperCase() || 'Н/Д'
  })

  return {
    statusClass,
    statusLabel,
  }
}
