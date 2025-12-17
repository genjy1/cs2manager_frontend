/**
 * Player Status Constants
 * Централизованные константы для статусов игроков
 */

export const PLAYER_STATUS = {
  MAIN_SQUAD: 'main_squad',
  BENCH: 'bench',
  FREE_AGENT: 'free_agent',
  IN_TEAM: 'in_team',
  INJURED: 'injured',
}

export const PLAYER_STATUS_LABELS = {
  [PLAYER_STATUS.MAIN_SQUAD]: 'Основной состав',
  [PLAYER_STATUS.BENCH]: 'Запасной',
  [PLAYER_STATUS.FREE_AGENT]: 'Свободный агент',
  [PLAYER_STATUS.IN_TEAM]: 'В команде',
  [PLAYER_STATUS.INJURED]: 'Травмирован',
}

export const PLAYER_STATUS_LABELS_SHORT = {
  [PLAYER_STATUS.MAIN_SQUAD]: 'ОСНОВА',
  [PLAYER_STATUS.BENCH]: 'ЗАПАСНОЙ',
  [PLAYER_STATUS.FREE_AGENT]: 'СВ. АГЕНТ',
  [PLAYER_STATUS.IN_TEAM]: 'В КОМАНДЕ',
  [PLAYER_STATUS.INJURED]: 'ТРАВМА',
}

export const PLAYER_STATUS_CLASSES = {
  [PLAYER_STATUS.MAIN_SQUAD]: 'bg-green-500/90 text-white border border-green-400',
  [PLAYER_STATUS.BENCH]: 'bg-blue-500/90 text-white border border-blue-400',
  [PLAYER_STATUS.FREE_AGENT]: 'bg-purple-500/90 text-white border border-purple-400',
  [PLAYER_STATUS.IN_TEAM]: 'bg-blue-500/90 text-white border border-blue-400',
  [PLAYER_STATUS.INJURED]: 'bg-red-500/90 text-white border border-red-400',
}

export const PLAYER_STATUS_OPTIONS = [
  { value: PLAYER_STATUS.FREE_AGENT, label: '🟢 Свободный агент' },
  { value: PLAYER_STATUS.IN_TEAM, label: '🔵 В команде' },
  { value: PLAYER_STATUS.INJURED, label: '🔴 Травмирован' },
]

export const DEFAULT_PLAYER_STATUS = PLAYER_STATUS.FREE_AGENT
