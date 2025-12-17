<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600 dark:text-gray-400">Загрузка игроков...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 text-lg mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="font-semibold">Ошибка загрузки</p>
        <p class="text-sm mt-2">{{ error }}</p>
      </div>
      <button
        @click="loadPlayers"
        class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
      >
        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Попробовать снова
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="players.length === 0" class="text-center py-16">
      <div class="bg-gray-100 dark:bg-gray-800 rounded-2xl p-12 max-w-md mx-auto">
        <svg
          class="w-24 h-24 mx-auto mb-6 text-gray-400 dark:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Нет игроков в базе</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Добавьте первого игрока, чтобы начать управление
        </p>
        <button
          @click="$emit('add-player')"
          class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium inline-flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Добавить игрока
        </button>
      </div>
    </div>

    <!-- Players View -->
    <div v-else>
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Все игроки</h2>

        <!-- Filter Tabs -->
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            :class="
              activeFilter === filter.value
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            "
          >
            <component :is="filter.icon" class="w-5 h-5" />
            <span>{{ filter.label }}</span>
            <span
              v-if="filter.count !== undefined"
              class="px-2 py-0.5 rounded-full text-xs font-bold"
              :class="
                activeFilter === filter.value
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              "
            >
              {{ filter.count }}
            </span>
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-90">Всего игроков</p>
                <p class="text-3xl font-bold mt-1">{{ players.length }}</p>
              </div>
              <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-90">Основной состав</p>
                <p class="text-3xl font-bold mt-1">{{ mainSquadCount }}</p>
              </div>
              <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-90">Запасные</p>
                <p class="text-3xl font-bold mt-1">{{ benchCount }}</p>
              </div>
              <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-90">Свободные агенты</p>
                <p class="text-3xl font-bold mt-1">{{ freeAgentsCount }}</p>
              </div>
              <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Average Rating -->
        <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Средний рейтинг {{ activeFilterLabel }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ averageRating }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600 dark:text-gray-400">Показано игроков</p>
            <p class="text-2xl font-bold text-orange-600">{{ filteredPlayers.length }}</p>
          </div>
        </div>
      </div>

      <!-- Players Grid -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <div
          v-for="player in filteredPlayers"
          :key="player.id"
          class="player-card group relative bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-all duration-300 border border-gray-700 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/20"
          @click="selectPlayer(player)"
        >
          <!-- Player Avatar/Image -->
          <div
            class="relative w-full aspect-square bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden"
          >
            <img
              v-if="getPlayerAvatar(player)"
              :src="getPlayerAvatar(player)"
              :alt="`${player.nickname || player.name}`"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              @error="handleImageError"
              loading="lazy"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-700"
            >
              <span class="text-white text-6xl font-black">
                {{ getInitials(player) }}
              </span>
            </div>

            <!-- Status Badge -->
            <div class="absolute top-3 left-3">
              <span
                class="px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm"
                :class="getStatusClass(player.player_status)"
              >
                {{ getStatusLabel(player.player_status) }}
              </span>
            </div>

            <!-- Hover Overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            >
              <div class="text-center">
                <svg
                  class="w-12 h-12 mx-auto text-white mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span class="text-white text-sm font-medium">Посмотреть профиль</span>
              </div>
            </div>
          </div>

          <!-- Player Info -->
          <div class="p-4">
            <!-- Nickname -->
            <div class="mb-3">
              <h3 class="text-xl font-bold text-white truncate mb-1">
                {{ player.nickname || `${player.name} ${player.surname}` }}
              </h3>
              <p v-if="player.nickname" class="text-sm text-gray-400 truncate">
                {{ player.name }} {{ player.surname }}
              </p>
            </div>

            <!-- Stats -->
            <div class="space-y-2">
              <!-- Rating -->
              <div class="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  <span class="text-xs text-gray-400 font-medium">Рейтинг</span>
                </div>
                <span class="text-lg font-bold text-orange-400">
                  {{ formatRating(player.rating) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty Filter State -->
      <div v-if="filteredPlayers.length === 0" class="text-center py-16">
        <svg
          class="w-20 h-20 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Нет игроков в категории "{{ activeFilterLabel }}"
        </p>
        <p class="text-gray-600 dark:text-gray-400">Попробуйте выбрать другой фильтр</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getData } from '@/utils/data/getData'
import { computed, onMounted, ref, h } from 'vue'
import { useRouter } from 'vue-router'

/* ================= STATE ================= */

const players = ref([])
const router = useRouter()
const isLoading = ref(false)
const error = ref(null)
const activeFilter = ref('all')

/* ================= ICONS ================= */

const AllIcon = () =>
  h('svg', { class: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', {
      d: 'M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z',
    }),
  ])

const MainSquadIcon = () =>
  h('svg', { class: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', {
      'fill-rule': 'evenodd',
      d: 'M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
      'clip-rule': 'evenodd',
    }),
  ])

const BenchIcon = () =>
  h('svg', { class: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { d: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' }),
  ])

const FreeAgentIcon = () =>
  h('svg', { class: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', {
      'fill-rule': 'evenodd',
      d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z',
      'clip-rule': 'evenodd',
    }),
  ])

/* ================= COMPUTED ================= */

/**
 * Количество игроков в основном составе
 */
const mainSquadCount = computed(() => {
  return players.value.filter((p) => p.player_status === 'main_squad').length
})

/**
 * Количество игроков на скамейке запасных
 */
const benchCount = computed(() => {
  return players.value.filter((p) => p.player_status === 'bench').length
})

/**
 * Количество свободных агентов
 */
const freeAgentsCount = computed(() => {
  return players.value.filter((p) => p.player_status === 'free_agent').length
})

/**
 * Фильтры с количеством
 */
const filters = computed(() => [
  {
    value: 'all',
    label: 'Все игроки',
    count: players.value.length,
    icon: AllIcon,
  },
  {
    value: 'main_squad',
    label: 'Основной состав',
    count: mainSquadCount.value,
    icon: MainSquadIcon,
  },
  {
    value: 'bench',
    label: 'Запасные',
    count: benchCount.value,
    icon: BenchIcon,
  },
  {
    value: 'free_agent',
    label: 'Свободные агенты',
    count: freeAgentsCount.value,
    icon: FreeAgentIcon,
  },
])

/**
 * Отфильтрованные игроки
 */
const filteredPlayers = computed(() => {
  if (activeFilter.value === 'all') {
    return players.value
  }

  return players.value.filter((p) => p.player_status === activeFilter.value)
})

/**
 * Название активного фильтра
 */
const activeFilterLabel = computed(() => {
  const filter = filters.value.find((f) => f.value === activeFilter.value)
  return filter ? filter.label.toLowerCase() : 'всех игроков'
})

/**
 * Средний рейтинг отфильтрованных игроков
 */
const averageRating = computed(() => {
  if (filteredPlayers.value.length === 0) return '0.00'

  const sum = filteredPlayers.value.reduce((acc, player) => {
    return acc + (parseFloat(player.rating) || 0)
  }, 0)

  return (sum / filteredPlayers.value.length).toFixed(2)
})

/* ================= METHODS ================= */

/**
 * Получить аватар игрока из массива images
 */
const getPlayerAvatar = (player) => {
  if (!player.images || !Array.isArray(player.images) || player.images.length === 0) {
    return null
  }

  const firstImage = player.images[0]

  if (!firstImage.base64) {
    return null
  }

  const mimeType = firstImage.mime_type || 'image/jpeg'

  return `data:${mimeType};base64,${firstImage.base64}`
}

/**
 * Получить инициалы игрока для placeholder
 */
const getInitials = (player) => {
  if (player.nickname) {
    return player.nickname.substring(0, 2).toUpperCase()
  }

  const firstName = player.name?.charAt(0) || ''
  const lastName = player.surname?.charAt(0) || ''
  return (firstName + lastName).toUpperCase() || '?'
}

/**
 * Форматировать рейтинг
 */
const formatRating = (rating) => {
  if (!rating && rating !== 0) return '0.00'
  return Number(rating).toFixed(2)
}

/**
 * Получить класс для статуса команды
 */
const getStatusClass = (status) => {
  const classes = {
    main_squad: 'bg-green-500/90 text-white border border-green-400',
    bench: 'bg-blue-500/90 text-white border border-blue-400',
    free_agent: 'bg-purple-500/90 text-white border border-purple-400',
  }

  return classes[status] || 'bg-gray-500/90 text-white border border-gray-400'
}

/**
 * Получить текст для статуса команды
 */
const getStatusLabel = (status) => {
  const labels = {
    main_squad: 'ОСНОВА',
    bench: 'ЗАПАСНОЙ',
    free_agent: 'СВ. АГЕНТ',
  }

  return labels[status] || status?.toUpperCase() || 'N/A'
}

/**
 * Обработка ошибки загрузки изображения
 */
const handleImageError = (event) => {
  console.error('Ошибка загрузки изображения:', event.target.src)
  event.target.style.display = 'none'
}

/**
 * Выбрать игрока
 */
const selectPlayer = (player) => {
  router.push({
    name: 'PlayerScorecard',
    params: { id: player.id, nickname: player.nickname },
  })
}

/* ================= API ================= */

/**
 * Загрузить игроков с сервера
 */
const loadPlayers = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await getData('players/get')
    players.value = response || []
  } catch (err) {
    console.error('Ошибка при загрузке игроков:', err)
    error.value = 'Не удалось загрузить базу игроков'
  } finally {
    isLoading.value = false
  }
}

/* ================= LIFECYCLE ================= */

onMounted(() => {
  loadPlayers()
})
</script>

<style scoped>
/* Анимация появления карточек */
.player-card {
  animation: fadeInUp 0.5s ease-out backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Задержка анимации для последовательного появления */
.player-card:nth-child(1) {
  animation-delay: 0.05s;
}
.player-card:nth-child(2) {
  animation-delay: 0.1s;
}
.player-card:nth-child(3) {
  animation-delay: 0.15s;
}
.player-card:nth-child(4) {
  animation-delay: 0.2s;
}
.player-card:nth-child(5) {
  animation-delay: 0.25s;
}
.player-card:nth-child(6) {
  animation-delay: 0.3s;
}
.player-card:nth-child(7) {
  animation-delay: 0.35s;
}
.player-card:nth-child(8) {
  animation-delay: 0.4s;
}
.player-card:nth-child(9) {
  animation-delay: 0.45s;
}
.player-card:nth-child(10) {
  animation-delay: 0.5s;
}

/* Плавная прокрутка */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
</style>
