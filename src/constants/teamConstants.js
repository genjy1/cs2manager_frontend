/**
 * Team Constants
 * Централизованные константы для команд
 */

export const TEAM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISBANDED: 'disbanded',
}

export const TEAM_STATUS_LABELS = {
  [TEAM_STATUS.ACTIVE]: 'Активная',
  [TEAM_STATUS.INACTIVE]: 'Неактивная',
  [TEAM_STATUS.DISBANDED]: 'Расформирована',
}

export const TEAM_STATUS_CLASSES = {
  [TEAM_STATUS.ACTIVE]: 'bg-green-500/90 text-white border border-green-400',
  [TEAM_STATUS.INACTIVE]: 'bg-gray-500/90 text-white border border-gray-400',
  [TEAM_STATUS.DISBANDED]: 'bg-red-500/90 text-white border border-red-400',
}

export const TEAM_STATUS_OPTIONS = [
  { value: TEAM_STATUS.ACTIVE, label: '✅ Активная' },
  { value: TEAM_STATUS.INACTIVE, label: '⏸️ Неактивная' },
  { value: TEAM_STATUS.DISBANDED, label: '❌ Расформирована' },
]

export const DEFAULT_TEAM_STATUS = TEAM_STATUS.ACTIVE

// Размеры команд
export const TEAM_SIZE = {
  MIN_PLAYERS: 5,
  MAX_PLAYERS: 10,
  MAIN_SQUAD: 5,
  BENCH: 5,
}

// Роли в команде
export const TEAM_ROLES = {
  CAPTAIN: 'captain',
  VICE_CAPTAIN: 'vice_captain',
  COACH: 'coach',
  ANALYST: 'analyst',
  MANAGER: 'manager',
}

export const TEAM_ROLE_LABELS = {
  [TEAM_ROLES.CAPTAIN]: 'Капитан',
  [TEAM_ROLES.VICE_CAPTAIN]: 'Вице-капитан',
  [TEAM_ROLES.COACH]: 'Тренер',
  [TEAM_ROLES.ANALYST]: 'Аналитик',
  [TEAM_ROLES.MANAGER]: 'Менеджер',
}
