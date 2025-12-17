<template>
  <header class="mx-auto my-4 w-4/5 flex justify-between items-center">
    <RouterLink to="/">
      <CSLogo class="dark:fill-white" />
    </RouterLink>

    <nav
      ref="navRef"
      class="border-2 dark:border-white rounded-full bg-white dark:bg-gray-800 shadow-md"
    >
      <ul class="flex items-center justify-around px-4 py-2 gap-4">
        <li
          v-for="item in navItems"
          :key="item.name"
          class="relative my-2"
          @mouseenter="onHoverStart(item)"
          @mouseleave="onHoverEnd"
        >
          <!-- пункт БЕЗ dropdown -->
          <RouterLink
            v-if="!item.items"
            :to="{ name: item.name }"
            class="px-4 py-2 block rounded-full cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {{ item.label }}
          </RouterLink>

          <!-- пункт С dropdown -->
          <button
            v-else
            type="button"
            class="px-4 py-2 rounded-full cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring"
            :aria-expanded="openItem === item.name"
            aria-haspopup="true"
            @click="onClick(item.name)"
            @keydown.enter.prevent="open(item.name)"
            @keydown.space.prevent="open(item.name)"
          >
            {{ item.label }}
          </button>

          <!-- Dropdown -->
          <transition name="dropdown">
            <ul
              v-if="item.items && openItem === item.name"
              class="absolute left-0 top-full mt-1 min-w-[180px] rounded-xl bg-white dark:bg-gray-800 shadow-lg z-50"
              role="menu"
            >
              <li v-for="subitem in item.items" :key="subitem.name" role="menuitem">
                <RouterLink
                  :to="{ name: subitem.name }"
                  class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 transition-colors outline-none"
                  @click="close"
                >
                  {{ subitem.label }}
                </RouterLink>
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </nav>

    <ButtonComponent @click="onAction" :label="isLoggedIn ? 'Выйти' : 'Войти'" />
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CSLogo from '@/icons/CSLogo.vue'
import ButtonComponent from './ButtonComponent.vue'

defineProps({
  isLoggedIn: Boolean,
  onAction: Function,
})

const navItems = ref([
  { name: 'Dashboard', label: 'Главная' },
  {
    name: 'Players',
    label: 'Игроки',
    items: [
      { name: 'PlayersManagement', label: 'CMS' },
      { name: 'Players', label: 'Список игроков' },
    ],
  },
  {
    name: 'Teams',
    label: 'Команды',
    items: [
      { name: 'TeamsManagement', label: 'CMS' },
      { name: 'Teams', label: 'Список команд' },
    ],
  },
  { name: 'Transfers', label: 'Трансферы' },
  { name: 'Matches', label: 'Матчи' },
])

const openItem = ref(null)
const navRef = ref(null)

let openTimer = null
let closeTimer = null

const HOVER_OPEN_DELAY = 180
const HOVER_CLOSE_DELAY = 220

const isMobile = () => window.matchMedia('(pointer: coarse)').matches

const clearTimers = () => {
  if (openTimer) clearTimeout(openTimer)
  if (closeTimer) clearTimeout(closeTimer)
}

const open = (name) => {
  clearTimers()
  openItem.value = name
}

const close = () => {
  clearTimers()
  openItem.value = null
}

const onHoverStart = (item) => {
  if (!item.items || isMobile()) return
  clearTimers()
  openTimer = setTimeout(() => (openItem.value = item.name), HOVER_OPEN_DELAY)
}

const onHoverEnd = () => {
  if (isMobile()) return
  clearTimers()
  closeTimer = setTimeout(() => (openItem.value = null), HOVER_CLOSE_DELAY)
}

const onClick = (name) => {
  openItem.value === name ? close() : open(name)
}

/* глобальный Esc */
const onKeydown = (e) => {
  if (e.key === 'Escape') close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.dropdown-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
