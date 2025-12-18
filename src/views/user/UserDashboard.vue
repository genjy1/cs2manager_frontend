<template>
  <div class="min-h-screen bg-gray-900 p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-white mb-2">
        CS2 Manager Dashboard
      </h1>
      <p class="text-gray-400">
        Добро пожаловать! Управляйте своими командами и игроками Counter-Strike 2
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Players Card -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-blue-500/20 p-3 rounded-lg">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          <span class="text-3xl font-bold text-white">{{ stats.players }}</span>
        </div>
        <h3 class="text-gray-300 font-semibold mb-1">Игроки</h3>
        <p class="text-sm text-gray-500">Всего в базе</p>
        <router-link to="/players" class="mt-4 inline-block text-blue-400 hover:text-blue-300 text-sm font-medium">
          Перейти к игрокам →
        </router-link>
      </div>

      <!-- Teams Card -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-green-500/20 p-3 rounded-lg">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <span class="text-3xl font-bold text-white">{{ stats.teams }}</span>
        </div>
        <h3 class="text-gray-300 font-semibold mb-1">Команды</h3>
        <p class="text-sm text-gray-500">Активных команд</p>
        <router-link to="/teams" class="mt-4 inline-block text-green-400 hover:text-green-300 text-sm font-medium">
          Перейти к командам →
        </router-link>
      </div>

      <!-- Matches Card -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-purple-500/20 p-3 rounded-lg">
            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <span class="text-3xl font-bold text-white">{{ stats.matches }}</span>
        </div>
        <h3 class="text-gray-300 font-semibold mb-1">Матчи</h3>
        <p class="text-sm text-gray-500">Проведено матчей</p>
        <router-link to="/matches" class="mt-4 inline-block text-purple-400 hover:text-purple-300 text-sm font-medium">
          Перейти к матчам →
        </router-link>
      </div>

      <!-- Transfers Card -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-yellow-500/20 p-3 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
            </svg>
          </div>
          <span class="text-3xl font-bold text-white">{{ stats.transfers }}</span>
        </div>
        <h3 class="text-gray-300 font-semibold mb-1">Трансферы</h3>
        <p class="text-sm text-gray-500">Всего трансферов</p>
        <router-link to="/transfers" class="mt-4 inline-block text-yellow-400 hover:text-yellow-300 text-sm font-medium">
          Перейти к трансферам →
        </router-link>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
      <h2 class="text-2xl font-bold text-white mb-6">Быстрые действия</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          to="/players/management"
          class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
        >
          <div class="bg-blue-500/20 p-3 rounded-lg mr-4 group-hover:bg-blue-500/30 transition-colors">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-white font-semibold">Добавить игрока</h3>
            <p class="text-sm text-gray-400">Создать нового игрока</p>
          </div>
        </router-link>

        <router-link
          to="/teams/management"
          class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
        >
          <div class="bg-green-500/20 p-3 rounded-lg mr-4 group-hover:bg-green-500/30 transition-colors">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-white font-semibold">Создать команду</h3>
            <p class="text-sm text-gray-400">Новая команда CS2</p>
          </div>
        </router-link>

        <router-link
          to="/matches"
          class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
        >
          <div class="bg-purple-500/20 p-3 rounded-lg mr-4 group-hover:bg-purple-500/30 transition-colors">
            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-white font-semibold">Запланировать матч</h3>
            <p class="text-sm text-gray-400">Создать новый матч</p>
          </div>
        </router-link>

        <router-link
          to="/transfers"
          class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
        >
          <div class="bg-yellow-500/20 p-3 rounded-lg mr-4 group-hover:bg-yellow-500/30 transition-colors">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-white font-semibold">Оформить трансфер</h3>
            <p class="text-sm text-gray-400">Перевод игрока</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity & Top Players -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 class="text-2xl font-bold text-white mb-6">Недавняя активность</h2>
        <div class="space-y-4">
          <div v-if="recentActivity.length === 0" class="text-center py-8">
            <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <p class="text-gray-400">Активность пока отсутствует</p>
          </div>
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="flex items-start p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors"
          >
            <div :class="['p-2 rounded-lg mr-4', activity.iconBg]">
              <svg class="w-5 h-5" :class="activity.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="activity.icon"></path>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-white font-medium">{{ activity.title }}</p>
              <p class="text-sm text-gray-400">{{ activity.description }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Players -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white">Топ игроки</h2>
          <router-link to="/players" class="text-blue-400 hover:text-blue-300 text-sm font-medium">
            Все игроки →
          </router-link>
        </div>
        <div class="space-y-3">
          <div v-if="topPlayers.length === 0" class="text-center py-8">
            <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <p class="text-gray-400">Игроки отсутствуют</p>
            <router-link to="/players/management" class="mt-4 inline-block text-blue-400 hover:text-blue-300 text-sm font-medium">
              Добавить игрока →
            </router-link>
          </div>
          <div
            v-for="(player, index) in topPlayers"
            :key="player.id"
            class="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors cursor-pointer"
            @click="goToPlayer(player)"
          >
            <div class="flex-shrink-0 mr-4">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {{ index + 1 }}
              </div>
            </div>
            <div class="flex-1">
              <p class="text-white font-semibold">{{ player.nickname }}</p>
              <p class="text-sm text-gray-400">{{ player.name }} {{ player.surname }}</p>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold text-yellow-500">{{ formatRating(player.rating) }}</div>
              <p class="text-xs text-gray-500">Рейтинг</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Welcome Message (if no data) -->
    <div
      v-if="stats.players === 0 && stats.teams === 0"
      class="mt-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-8 text-center"
    >
      <h2 class="text-3xl font-bold text-white mb-4">Добро пожаловать в CS2 Manager!</h2>
      <p class="text-gray-300 mb-6 max-w-2xl mx-auto">
        Начните управление вашими командами Counter-Strike 2. Создайте игроков, сформируйте команды, планируйте матчи и отслеживайте трансферы.
      </p>
      <div class="flex items-center justify-center gap-4">
        <router-link
          to="/players/management"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Создать первого игрока
        </router-link>
        <router-link
          to="/teams/management"
          class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          Создать команду
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getData } from '@/utils/data/getData'
import { formatRating } from '@/composables/useFormatters'

const router = useRouter()

// Stats
const stats = ref({
  players: 0,
  teams: 0,
  matches: 0,
  transfers: 0,
})

// Recent Activity
const recentActivity = ref([
  // Example data structure:
  // {
  //   id: 1,
  //   title: 'Новый игрок добавлен',
  //   description: 's1mple добавлен в систему',
  //   time: '5 минут назад',
  //   icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  //   iconBg: 'bg-blue-500/20',
  //   iconColor: 'text-blue-500',
  // },
])

// Top Players
const topPlayers = ref([])

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    // Fetch players
    const playersData = await getData('players/get')
    if (playersData && Array.isArray(playersData)) {
      stats.value.players = playersData.length

      // Get top 5 players by rating
      topPlayers.value = [...playersData]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 5)
    }

    // Fetch teams
    const teamsData = await getData('teams/get')
    if (teamsData && Array.isArray(teamsData)) {
      stats.value.teams = teamsData.length
    }

    // TODO: Fetch matches and transfers when endpoints are available
    // For now, using placeholder values
    stats.value.matches = 0
    stats.value.transfers = 0

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

// Navigate to player scorecard
const goToPlayer = (player) => {
  router.push({
    name: 'PlayerScorecard',
    params: { id: player.id, nickname: player.nickname },
  })
}

// Load data on mount
onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.bg-gray-650 {
  background-color: #3f4654;
}
</style>
