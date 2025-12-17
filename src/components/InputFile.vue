<template>
  <div class="space-y-2">
    <!-- Input -->
    <input
      ref="inputRef"
      type="file"
      :accept="accept"
      :disabled="disabled"
      class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-600/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      @change="onChange"
    />

    <!-- Ошибка -->
    <p v-if="error" class="text-sm text-red-600">
      {{ error }}
    </p>

    <!-- Превью -->
    <div v-if="preview" class="mt-2 relative inline-block">
      <img
        :src="preview"
        alt="Превью изображения"
        class="max-h-40 rounded border border-gray-300 object-contain"
      />

      <button
        type="button"
        class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
        @click="clear"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

/* ================= props ================= */
const props = defineProps({
  modelValue: {
    type: [File, null],
    default: null,
  },
  accept: {
    type: String,
    default: 'image/*',
  },
  maxSizeMb: {
    type: Number,
    default: 5, // 5 MB
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

/* ================= emits ================= */
const emit = defineEmits(['update:modelValue', 'error'])

/* ================= state ================= */
const inputRef = ref(null)
const preview = ref(null)
const error = ref(null)

/* ================= helpers ================= */
const revokePreview = () => {
  if (preview.value) {
    URL.revokeObjectURL(preview.value)
    preview.value = null
  }
}

const validateFile = (file) => {
  if (!file.type.startsWith('image/')) {
    return 'Файл должен быть изображением'
  }

  const maxBytes = props.maxSizeMb * 1024 * 1024
  if (file.size > maxBytes) {
    return `Размер файла не должен превышать ${props.maxSizeMb} МБ`
  }

  return null
}

/* ================= handlers ================= */
const onChange = (event) => {
  const file = event.target.files?.[0] ?? null
  error.value = null

  revokePreview()

  if (!file) {
    emit('update:modelValue', null)
    return
  }

  const validationError = validateFile(file)
  if (validationError) {
    error.value = validationError
    emit('error', validationError)
    emit('update:modelValue', null)
    resetInput()
    return
  }

  preview.value = URL.createObjectURL(file)
  emit('update:modelValue', file)

  resetInput()
}

const resetInput = () => {
  if (inputRef.value) {
    inputRef.value.value = ''
  }
}

const clear = () => {
  revokePreview()
  error.value = null
  emit('update:modelValue', null)
}

/* ================= watchers ================= */
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      revokePreview()
    }
  },
)

/* ================= lifecycle ================= */
onBeforeUnmount(() => {
  revokePreview()
})
</script>

<style scoped>
img {
  display: block;
}
</style>
