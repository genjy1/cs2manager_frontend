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
            class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <header class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold">
                {{ isEditMode ? 'Редактировать команду' : 'Добавить команду' }}
              </h2>
              <button
                class="text-gray-500 hover:text-red-500"
                @click="closeModal"
                aria-label="Закрыть"
              >
                ✕
              </button>
            </header>

            <form class="space-y-4" @submit.prevent="saveTeam">
              <FormGroup label="Название команды">
                <InputText v-model="newTeam.name" required placeholder="Введите название команды" />
              </FormGroup>

              <FormGroup label="Тег команды">
                <InputText v-model="newTeam.tag" required placeholder="TAG" maxlength="5" />
                <p class="text-xs text-gray-500 mt-1">Короткое название (максимум 5 символов)</p>
              </FormGroup>

              <FormGroup label="Статус команды">
                <div class="relative">
                  <select
                    name="status"
                    v-model="newTeam.status"
                    class="w-full appearance-none p-3 pr-10 border-2 rounded-lg border-gray-300 dark:border-white bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  >
                    <option
                      v-for="option in teamStatusOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>

                  <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    ▼
                  </span>
                </div>
              </FormGroup>

              <FormGroup label="Логотип команды">
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/20 dark:file:text-orange-400 dark:hover:file:bg-orange-900/30 cursor-pointer"
                  @change="handleFileChange"
                />
                <p v-if="filePreview" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Выбран файл: {{ newTeam.logo?.name }}
                </p>
                <div v-if="filePreview" class="mt-3">
                  <img
                    :src="filePreview"
                    alt="Предпросмотр логотипа"
                    class="w-24 h-24 object-contain rounded-lg border bg-white p-2"
                  />
                </div>
              </FormGroup>

              <FormGroup label="Описание">
                <textarea
                  v-model="newTeam.description"
                  rows="3"
                  class="w-full p-3 border-2 rounded-lg border-gray-300 dark:border-white bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition resize-none"
                  placeholder="Краткое описание команды..."
                ></textarea>
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
        label="Добавить команду"
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
            <th class="p-3 text-left">Лого</th>
            <th class="p-3 text-left">Команда</th>
            <th class="p-3 text-left">Тег</th>
            <th class="p-3 text-left">Статус</th>
            <th class="p-3 text-right">Действия</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="!filteredItems.length">
            <td colspan="6" class="p-4 text-center text-gray-400">Ничего не найдено</td>
          </tr>

          <tr
            v-for="(item, index) in paginatedItems"
            :key="item.id"
            class="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <td class="p-3">
              {{ (page - 1) * pageSize + index + 1 }}
            </td>
            <td class="p-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <img
                  v-if="getTeamLogo(item)"
                  :src="getTeamLogo(item)"
                  :alt="item.name"
                  class="w-10 h-10 object-contain"
                />
                <div
                  v-else
                  class="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded text-white flex items-center justify-center font-bold text-sm"
                >
                  {{ getTeamInitials(item) }}
                </div>
              </div>
            </td>
            <td class="p-3">
              <span class="font-medium">{{ item.name }}</span>
            </td>
            <td class="p-3">
              <span class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
                {{ item.tag || '-' }}
              </span>
            </td>
            <td class="p-3">
              <span
                class="px-2 py-1 rounded-full text-xs font-semibold"
                :class="getStatusClass(item.status)"
              >
                {{ getStatusLabel(item.status) }}
              </span>
            </td>
            <td class="p-3 text-right space-x-2">
              <button class="text-blue-500 hover:underline" @click="editTeam(item)">
                Редактировать
              </button>
              <button class="text-red-500 hover:underline" @click="deleteTeam(item.id)">
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
import {
  TEAM_STATUS_OPTIONS,
  DEFAULT_TEAM_STATUS,
  TEAM_STATUS_LABELS,
  TEAM_STATUS_CLASSES,
} from '@/constants/teamConstants'

/* ================= CONSTANTS ================= */

const teamStatusOptions = TEAM_STATUS_OPTIONS

/* ================= STATE ================= */

const isModalActive = ref(false)
const isSubmitting = ref(false)
const modalRef = ref(null)
const fileInputRef = ref(null)
const buttonLabel = ref('Сохранить')
const isEditMode = ref(false)
const editingTeamId = ref(null)

const search = ref('')
const pageSize = ref(10)
const page = ref(1)
const teams = ref([])
const filePreview = ref(null)

const newTeam = ref({
  name: '',
  tag: '',
  status: DEFAULT_TEAM_STATUS,
  description: '',
  logo: null,
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
  editingTeamId.value = null
  resetForm()
}

/* ================= FILE HANDLING ================= */

const toast = useToast()

const handleFileChange = (event) => {
  const file = event.target.files?.[0]

  if (!file) {
    newTeam.value.logo = null
    filePreview.value = null
    return
  }

  // Валидация типа файла
  if (!file.type.startsWith('image/')) {
    toast.error('Пожалуйста, выберите изображение')
    event.target.value = ''
    return
  }

  // Валидация размера файла (5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    toast.error('Размер файла не должен превышать 5MB')
    event.target.value = ''
    return
  }

  newTeam.value.logo = file

  // Создаём предпросмотр изображения
  const reader = new FileReader()
  reader.onload = (e) => {
    filePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

/* ================= COMPUTED ================= */

const filteredItems = computed(() => {
  if (!search.value) return teams.value

  const q = search.value.toLowerCase()
  return teams.value.filter((t) => [t.name, t.tag, t.description].join(' ').toLowerCase().includes(q))
})

const paginatedItems = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredItems.value.slice(start, start + pageSize.value)
})

const resetForm = () => {
  newTeam.value = {
    name: '',
    tag: '',
    status: DEFAULT_TEAM_STATUS,
    description: '',
    logo: null,
  }
  filePreview.value = null

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

watch([search, pageSize], () => (page.value = 1))

/* ================= HELPERS ================= */

const getTeamLogo = (team) => {
  if (!team.images || !team.images.length || !team.images[0].base64) {
    return null
  }
  const mimeType = team.images[0].mime_type || 'image/png'
  return `data:${mimeType};base64,${team.images[0].base64}`
}

const getTeamInitials = (team) => {
  if (!team.name) return '?'
  const words = team.name.trim().split(/\s+/)
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
  }
  return team.name.substring(0, 2).toUpperCase()
}

const getStatusClass = (status) => {
  return TEAM_STATUS_CLASSES[status] || 'bg-gray-500/90 text-white border border-gray-400'
}

const getStatusLabel = (status) => {
  return TEAM_STATUS_LABELS[status] || status?.toUpperCase() || 'Н/Д'
}

/* ================= ACTIONS ================= */

const editTeam = async (team) => {
  isEditMode.value = true
  editingTeamId.value = team.id

  newTeam.value = {
    name: team.name,
    tag: team.tag || '',
    status: team.status || DEFAULT_TEAM_STATUS,
    description: team.description || '',
    logo: null,
  }

  if (team.images && team.images.length > 0 && team.images[0].base64) {
    const mimeType = team.images[0].mime_type || 'image/png'
    filePreview.value = `data:${mimeType};base64,${team.images[0].base64}`
  }

  await openModal()
}

const saveTeam = async () => {
  // Валидация
  if (!newTeam.value.name.trim()) {
    toast.error('Пожалуйста, введите название команды')
    return
  }

  if (!newTeam.value.tag.trim()) {
    toast.error('Пожалуйста, введите тег команды')
    return
  }

  isSubmitting.value = true
  buttonLabel.value = 'Сохранение...'

  try {
    const payload = {
      name: newTeam.value.name.trim(),
      tag: newTeam.value.tag.trim().toUpperCase(),
      status: newTeam.value.status,
      description: newTeam.value.description.trim(),
      logo: null,
      mime_type: null,
    }

    // Обработка логотипа
    if (newTeam.value.logo instanceof File) {
      try {
        const result = await toBase64(newTeam.value.logo)
        payload.logo = result.base64
        payload.mime_type = result.mime
      } catch (err) {
        console.error('Ошибка при конвертации изображения:', err)
        toast.error('Не удалось обработать изображение')
        return
      }
    }

    let response
    if (isEditMode.value) {
      // Обновление существующей команды
      response = await postData(`team/${editingTeamId.value}/update`, payload)

      const index = teams.value.findIndex((t) => t.id === editingTeamId.value)
      if (index !== -1) {
        teams.value[index] = {
          ...teams.value[index],
          name: payload.name,
          tag: payload.tag,
          status: payload.status,
          description: payload.description,
          ...(response.images && { images: response.images }),
        }
      }

      toast.success('Команда успешно обновлена!')
    } else {
      // Создание новой команды
      response = await postData('team/new', payload)

      teams.value.push({
        id: response.id || Date.now(),
        name: payload.name,
        tag: payload.tag,
        status: payload.status,
        description: payload.description,
        ...(response.images && { images: response.images }),
      })

      toast.success('Команда успешно добавлена!')
    }

    resetForm()
    closeModal()
  } catch (err) {
    console.error('Ошибка при сохранении команды:', err)
    const errorMessage =
      err.data?.message || `Произошла ошибка при ${isEditMode.value ? 'обновлении' : 'создании'} команды`
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
    buttonLabel.value = 'Сохранить'
  }
}

const deleteTeam = async (id) => {
  if (!confirm('Вы уверены, что хотите удалить команду?')) {
    return
  }

  try {
    await postData(`team/${id}/delete`)
    teams.value = teams.value.filter((t) => t.id !== id)
    toast.success('Команда успешно удалена!')
  } catch (error) {
    console.error('Ошибка при удалении команды:', error)
    toast.error(error.data?.message || 'Произошла ошибка при удалении команды')
  }
}

/* ================= LIFECYCLE ================= */

onMounted(async () => {
  try {
    teams.value = await getData('teams/get')
  } catch (error) {
    console.error('Ошибка при загрузке команд:', error)
    toast.error('Не удалось загрузить список команд')
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
