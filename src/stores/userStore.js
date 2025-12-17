import { postData } from '@/utils/data/postData'
import { defineStore } from 'pinia'

const storage = localStorage

export const useUserStore = defineStore('userStore', {
  state: () => ({
    isAuth: false,
    isAdmin: false,
    accessToken: storage.getItem('access_token') || null,
  }),

  actions: {
    async login(data) {
      try {
        const response = await postData('login', data)

        // Проверяем успешность логина
        if (response && response.access_token) {
          this.accessToken = response.access_token
          storage.setItem('access_token', response.access_token)
          this.isAuth = true
          return { success: true }
        }

        return { success: false, error: 'Invalid response from server' }
      } catch (error) {
        console.error('Login error:', error)
        return { success: false, error: error.data?.message || 'Login failed' }
      }
    },

    checkAuth() {
      const token = storage.getItem('access_token')

      if (token) {
        this.isAuth = true
        this.accessToken = token
      } else {
        this.isAuth = false
        this.accessToken = null
      }
    },

    logout() {
      storage.removeItem('access_token')
      this.isAuth = false
      this.accessToken = null
    },
  },
})
