<template>
  <!-- MODAL -->
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isModalActive"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        @click.self="closeModal"
        tabindex="0"
        @keydown.esc="closeModal"
      >
        <transition name="modal-scale">
          <div
            v-if="isModalActive"
            ref="modalRef"
            class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg p-6"
            role="dialog"
            aria-modal="true"
          >
            <header class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold">
                {{ isEditMode ? 'Редактировать игрока' : 'Добавить игрока' }}
              </h2>
              <button
                class="text-gray-500 hover:text-red-500"
                @click="closeModal"
                aria-label="Закрыть"
              >
                ✕
              </button>
            </header>

            <form class="space-y-4" @submit.prevent="savePlayer">
              <FormGroup label="Имя">
                <InputText v-model="newPlayer.name" required />
              </FormGroup>

              <FormGroup label="Фамилия">
                <InputText v-model="newPlayer.surname" required />
              </FormGroup>

              <FormGroup label="Никнейм">
                <InputText v-model="newPlayer.nickname" required />
              </FormGroup>

              <FormGroup label="Статус игрока">
                <div class="relative">
                  <select
                    name="status"
                    v-model="newPlayer.status"
                    class="w-full appearance-none p-3 pr-10 border-2 rounded-lg border-white bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  >
                    <option
                      v-for="option in playerStatusOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>

                  <!-- Стрелка -->
                  <span
                    class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white"
                  >
                    ▼
                  </span>
                </div>
              </FormGroup>

              <FormGroup label="Аватар">
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/20 dark:file:text-orange-400 dark:hover:file:bg-orange-900/30 cursor-pointer"
                  @change="handleFileChange"
                />
                <p v-if="filePreview" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Выбран файл: {{ newPlayer.avatar?.name }}
                </p>
                <div v-if="filePreview" class="mt-3">
                  <img
                    :src="filePreview"
                    alt="Предпросмотр аватара"
                    class="w-24 h-24 object-cover rounded-lg border"
                  />
                </div>
              </FormGroup>

              <FormGroup label="Рейтинг">
                <InputText v-model="newPlayer.rating" type="number" step="0.01" min="0" />
              </FormGroup>

              <ButtonComponent
                type="submit"
                :label="buttonLabel"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                class="bg-orange-600 hover:bg-orange-600/80 w-full"
              />
            </form>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>

  <!-- CONTROLS -->
  <div class="container mx-auto my-12 w-4/5 space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <FormGroup label="Поиск">
        <InputText v-model="search" placeholder="Введите запрос…" />
      </FormGroup>

      <FormGroup label="Записей на странице">
        <select v-model.number="pageSize" class="p-3 rounded border bg-transparent">
          <option :value="10">10</option>
          <option :value="15">15</option>
          <option :value="20">20</option>
        </select>
      </FormGroup>

      <ButtonComponent
        label="Добавить"
        @click="openModal"
        class="bg-orange-600 hover:bg-orange-600/70!"
      />
    </div>

    <!-- TABLE -->
    <div class="overflow-x-auto">
      <table class="w-full border rounded-lg">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="p-3 text-left">#</th>
            <th class="p-3 text-left">Игрок</th>
            <th class="p-3 text-left">Рейтинг</th>
            <th class="p-3 text-right">Действия</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="!filteredItems.length">
            <td colspan="4" class="p-4 text-center text-gray-400">Ничего не найдено</td>
          </tr>

          <tr
            v-for="(item, index) in paginatedItems"
            :key="index"
            class="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <td class="p-3">
              {{ (page - 1) * pageSize + index + 1 }}
            </td>
            <td class="p-3">
              {{ item.nickname || `${item.name} ${item.surname}` }}
            </td>
            <td class="p-3">
              {{ item.rating }}
            </td>
            <td class="p-3 text-right space-x-2">
              <button class="text-blue-500 hover:underline" @click="editPlayer(item)">
                Редактировать
              </button>
              <button class="text-red-500 hover:underline" @click="deletePlayer(item.id)">
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useToast } from 'vue-toastification'

import InputText from '@/components/InputText.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import FormGroup from '@/components/FormGroup.vue'
import { getData } from '@/utils/data/getData'
import { toBase64 } from '@/utils/data/toBase64'
import { postData } from '@/utils/data/postData'
import { PLAYER_STATUS_OPTIONS, DEFAULT_PLAYER_STATUS } from '@/constants/playerStatus'

/* ================= CONSTANTS ================= */

const playerStatusOptions = PLAYER_STATUS_OPTIONS

/* ================= STATE ================= */

const isModalActive = ref(false)
const isSubmitting = ref(false)
const modalRef = ref(null)
const fileInputRef = ref(null)
const buttonLabel = ref('Сохранить')
const isEditMode = ref(false)
const editingPlayerId = ref(null)

const search = ref('')
const pageSize = ref(10)
const page = ref(1)
const players = ref([])
const filePreview = ref(null)

const newPlayer = ref({
  name: '',
  surname: '',
  nickname: '',
  rating: '',
  status: DEFAULT_PLAYER_STATUS,
  avatar: null,
})

/* ================= MODAL ================= */

const openModal = async () => {
  isModalActive.value = true
  await nextTick()
  modalRef.value?.focus()
}

const closeModal = () => {
  isModalActive.value = false
  isEditMode.value = false
  editingPlayerId.value = null
  resetForm()
}

/* ================= FILE HANDLING ================= */

const handleFileChange = (event) => {
  const file = event.target.files?.[0]

  if (!file) {
    newPlayer.value.avatar = null
    filePreview.value = null
    return
  }

  // Валидация типа файла
  if (!file.type.startsWith('image/')) {
    toast.error('Пожалуйста, выберите изображение')
    event.target.value = ''
    return
  }

  // Валидация размера файла (например, 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    toast.error('Размер файла не должен превышать 5MB')
    event.target.value = ''
    return
  }

  newPlayer.value.avatar = file

  // Создаём предпросмотр изображения
  const reader = new FileReader()
  reader.onload = (e) => {
    filePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

/* ================= COMPUTED ================= */

const filteredItems = computed(() => {
  if (!search.value) return players.value

  const q = search.value.toLowerCase()
  return players.value.filter((p) =>
    [p.name, p.surname, p.nickname].join(' ').toLowerCase().includes(q),
  )
})

const paginatedItems = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredItems.value.slice(start, start + pageSize.value)
})

const resetForm = () => {
  newPlayer.value = {
    name: '',
    surname: '',
    nickname: '',
    rating: '',
    status: DEFAULT_PLAYER_STATUS,
    avatar: null,
  }
  filePreview.value = null

  // Очищаем input file
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

watch([search, pageSize], () => (page.value = 1))

/* ================= ACTIONS ================= */

// Импорт в начале файла

// В setup()
const toast = useToast()

const editPlayer = async (player) => {
  isEditMode.value = true
  editingPlayerId.value = player.id

  // Заполняем форму данными игрока
  newPlayer.value = {
    name: player.name,
    surname: player.surname,
    nickname: player.nickname,
    rating: player.rating.toString(),
    status: player.player_status || DEFAULT_PLAYER_STATUS,
    avatar: null,
  }

  // Если у игрока есть аватар, показываем его
  if (player.images && player.images.length > 0 && player.images[0].base64) {
    const mimeType = player.images[0].mime_type || 'image/jpeg'
    filePreview.value = `data:${mimeType};base64,${player.images[0].base64}`
  }

  await openModal()
}

const savePlayer = async () => {
  // Валидация
  if (!newPlayer.value.name.trim()) {
    toast.error('Пожалуйста, введите имя игрока')
    return
  }

  if (!newPlayer.value.surname.trim()) {
    toast.error('Пожалуйста, введите фамилию игрока')
    return
  }

  if (!newPlayer.value.nickname.trim()) {
    toast.error('Пожалуйста, введите никнейм игрока')
    return
  }

  if (!newPlayer.value.rating || parseFloat(newPlayer.value.rating) < 0) {
    toast.error('Пожалуйста, введите корректный рейтинг')
    return
  }

  isSubmitting.value = true
  buttonLabel.value = 'Сохранение...'

  try {
    const payload = {
      name: newPlayer.value.name.trim(),
      surname: newPlayer.value.surname.trim(),
      nickname: newPlayer.value.nickname.trim(),
      rating: parseFloat(newPlayer.value.rating),
      player_status: newPlayer.value.status,
      avatar: null,
      mime_type: null,
    }

    // Обработка аватара
    if (newPlayer.value.avatar instanceof File) {
      try {
        const result = await toBase64(newPlayer.value.avatar)
        payload.avatar = result.base64
        payload.mime_type = result.mime
      } catch (err) {
        console.error('Ошибка при конвертации изображения:', err)
        toast.error('Не удалось обработать изображение')
        return
      }
    }

    // Отправка данных
    let response
    if (isEditMode.value) {
      // Обновление существующего игрока
      response = await postData(`player/${editingPlayerId.value}/update`, payload)

      // Обновляем игрока в списке
      const index = players.value.findIndex((p) => p.id === editingPlayerId.value)
      if (index !== -1) {
        players.value[index] = {
          ...players.value[index],
          name: payload.name,
          surname: payload.surname,
          nickname: payload.nickname,
          rating: payload.rating,
          ...(response.images && { images: response.images }),
        }
      }

      toast.success('Игрок успешно обновлен!')
    } else {
      // Создание нового игрока
      response = await postData('player/new', payload)

      // Добавляем игрока в список
      players.value.push({
        id: response.id || Date.now(),
        name: payload.name,
        surname: payload.surname,
        nickname: payload.nickname,
        rating: payload.rating,
        ...(response.images && { images: response.images }),
      })

      toast.success('Игрок успешно добавлен!')
    }

    resetForm()
    closeModal()
  } catch (err) {
    console.error('Ошибка при сохранении игрока:', err)
    const errorMessage =
      err.data?.message ||
      `Произошла ошибка при ${isEditMode.value ? 'обновлении' : 'создании'} игрока`
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
    buttonLabel.value = 'Сохранить'
  }
}
const deletePlayer = async (id) => {
  if (!confirm('Вы уверены, что хотите удалить игрока?')) {
    return
  }

  try {
    await postData(`player/${id}/delete`)
    // Удаляем игрока из локального массива после успешного удаления
    players.value = players.value.filter((p) => p.id !== id)
    toast.success('Игрок успешно удален!')
  } catch (error) {
    console.error('Ошибка при удалении игрока:', error)
    toast.error(error.data?.message || 'Произошла ошибка при удалении игрока')
  }
}

/* ================= LIFECYCLE ================= */

onMounted(async () => {
  try {
    players.value = await getData('players/get')
  } catch (error) {
    console.error('Ошибка при загрузке игроков:', error)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.2s ease;
}
.modal-scale-enter-from {
  transform: scale(0.95);
  opacity: 0;
}
.modal-scale-enter-to {
  transform: scale(1);
  opacity: 1;
}
.modal-scale-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>
