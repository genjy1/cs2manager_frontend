<script setup>
import { computed } from 'vue'
import HeaderNav from './components/HeaderNav.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'
import { useUserStore } from './stores/userStore'
import router from './router'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isAuth)

const action = () => {
  if (isLoggedIn.value) {
    userStore.logout()
  } else {
    router.push({ name: 'Login' })
  }
}
</script>

<template>
  <HeaderNav :is-logged-in="isLoggedIn" @action="action"></HeaderNav>
  <RouterView></RouterView>
  <NotificationContainer />
</template>
