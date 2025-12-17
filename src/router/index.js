import LoginView from '@/views/user/LoginView.vue'
import PlayersDashboard from '@/views/user/players/PlayersDashboard.vue'
import RegisterView from '@/views/user/RegisterView.vue'
import UserDashboard from '@/views/user/UserDashboard.vue'
import MatchesView from '@/views/user/MatchesView.vue'
import TransfersList from '@/views/user/TransfersList.vue'
import PlayersManagementDashboard from '@/views/user/players/PlayersManagementDashboard.vue'
import TeamsManagementDashboard from '@/views/user/teams/TeamsManagementDashboard.vue'
import TeamsDashboard from '@/views/user/teams/TeamsDashboard.vue'

import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import PlayerScorecard from '@/views/user/players/PlayerScorecard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    { name: 'Login', path: '/login', component: LoginView },
    { name: 'Register', path: '/register', component: RegisterView },

    { name: 'Dashboard', path: '/', component: UserDashboard, meta: { needsAuth: true } },
    { name: 'Players', path: '/players', component: PlayersDashboard, meta: { needsAuth: true } },
    {
      name: 'PlayersManagement',
      path: '/players/management',
      component: PlayersManagementDashboard,
      meta: { needsAuth: true },
    },
    {
      name: 'TeamsManagement',
      path: '/teams/management',
      component: TeamsManagementDashboard,
      meta: { needsAuth: true },
    },
    { name: 'Teams', path: '/teams', component: TeamsDashboard, meta: { needsAuth: true } },

    { name: 'Matches', path: '/matches', component: MatchesView, meta: { needsAuth: true } },
    { name: 'Transfers', path: '/transfers', component: TransfersList, meta: { needsAuth: true } },
    {
      name: 'PlayerScorecard',
      path: '/player/:id/:nickname',
      component: PlayerScorecard,
      meta: { needsAuth: true },
    },
  ],
})

router.beforeEach((to, _) => {
  const userStore = useUserStore()

  // проверяем токен в localStorage
  userStore.checkAuth()

  // если маршрут защищён и авторизации нет → редирект
  if (to.meta.needsAuth && !userStore.isAuth) {
    return { name: 'Login' }
  }

  return true
})

export default router
