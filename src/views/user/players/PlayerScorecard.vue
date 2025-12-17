<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600 dark:text-gray-400">Загрузка данных игрока...</p>
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
        @click="loadPlayer"
        class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium mr-4"
      >
        Попробовать снова
      </button>
      <button
        @click="goBack"
        class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
      >
        Вернуться назад
      </button>
    </div>

    <!-- Player Profile -->
    <div v-else-if="player.id" class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>Назад к списку игроков</span>
      </button>

      <!-- Player Card -->
      <div
        class="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-2xl"
      >
        <!-- Header with Avatar -->
        <div class="relative h-64 bg-gradient-to-br from-orange-600 to-orange-700">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="relative">
              <!-- Avatar -->
              <div class="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img
                  v-if="playerAvatar"
                  :src="playerAvatar"
                  :alt="player.nickname || player.name"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 text-white text-5xl font-black"
                >
                  {{ playerInitials }}
                </div>
              </div>

              <!-- Status Badge -->
              <div class="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                <span
                  class="px-4 py-1 text-xs font-bold rounded-full backdrop-blur-sm"
                  :class="getStatusClass"
                >
                  {{ getStatusLabel }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Player Info -->
        <div class="p-8 text-white">
          <!-- Name and Nickname -->
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold mb-2">
              {{ player.nickname || `${player.name} ${player.surname}` }}
            </h1>
            <p v-if="player.nickname" class="text-xl text-gray-400">
              {{ player.name }} {{ player.surname }}
            </p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Rating -->
            <div class="bg-gray-800/50 rounded-xl p-6 text-center">
              <div class="flex items-center justify-center gap-2 mb-2">
                <svg class="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <span class="text-sm text-gray-400 font-medium">Рейтинг</span>
              </div>
              <p class="text-4xl font-bold text-orange-400">{{ formatPlayerRating }}</p>
            </div>

            <!-- Player ID -->
            <div class="bg-gray-800/50 rounded-xl p-6 text-center">
              <div class="flex items-center justify-center gap-2 mb-2">
                <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78-.07 1.635.49 2.24A3.989 3.989 0 007 16a3.989 3.989 0 002.328-1.066c.56-.605.74-1.46.49-2.24l-.818-2.552c-.25-.78-.07-1.635.49-2.24A3.989 3.989 0 007 7a3.989 3.989 0 00-2.328 1.066c-.56.605-.74 1.46-.49 2.24l.818 2.552z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-400 font-medium">ID</span>
              </div>
              <p class="text-4xl font-bold text-blue-400">#{{ player.id }}</p>
            </div>

            <!-- Team Status -->
            <div class="bg-gray-800/50 rounded-xl p-6 text-center">
              <div class="flex items-center justify-center gap-2 mb-2">
                <svg class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
                  />
                </svg>
                <span class="text-sm text-gray-400 font-medium">Статус</span>
              </div>
              <p class="text-2xl font-bold text-green-400">{{ getStatusLabel }}</p>
            </div>
          </div>

          <!-- Additional Info -->
          <div v-if="player.created_at || player.updated_at" class="mt-8 pt-6 border-t border-gray-700">
            <h3 class="text-lg font-semibold mb-4 text-gray-300">Дополнительная информация</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div v-if="player.created_at" class="flex items-center gap-2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Создан: {{ formatDate(player.created_at) }}</span>
              </div>
              <div v-if="player.updated_at" class="flex items-center gap-2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Обновлен: {{ formatDate(player.updated_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getData } from '@/utils/data/getData'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerImage } from '@/composables/usePlayerImage'
import { usePlayerStatus } from '@/composables/usePlayerStatus'
import { formatRating, formatDate } from '@/composables/useFormatters'

const player = ref({})
const route = useRoute()
const router = useRouter()
const id = ref(route.params.id)
const isLoading = ref(false)
const error = ref(null)

// Используем composables
const { playerAvatar, playerInitials, handleImageError } = usePlayerImage(player)
const playerStatus = computed(() => player.value.player_status)
const { statusClass: getStatusClass, statusLabel: getStatusLabel } = usePlayerStatus(playerStatus)

/**
 * Получить данные игрока с сервера
 */
const getPlayer = async (playerId) => {
  isLoading.value = true
  error.value = null

  try {
    const response = await getData(`player/${playerId}/get`)
    player.value = response || {}

    if (!response || !response.id) {
      error.value = 'Игрок не найден'
    }
  } catch (err) {
    console.error('Ошибка при загрузке игрока:', err)
    error.value = err.data?.message || 'Не удалось загрузить данные игрока'
  } finally {
    isLoading.value = false
  }
}

/**
 * Перезагрузить данные игрока
 */
const loadPlayer = () => {
  getPlayer(id.value)
}

/**
 * Вернуться на предыдущую страницу
 */
const goBack = () => {
  router.back()
}

/**
 * Форматировать рейтинг
 */
const formatPlayerRating = computed(() => formatRating(player.value.rating))

onMounted(() => {
  loadPlayer()
})
</script>
