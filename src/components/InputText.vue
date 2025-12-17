<template>
  <input
    type="text"
    :id="id"
    :name="name"
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
    class="border-2 border-white rounded p-2 p-3"
    :class="fluid ? 'w-full' : 'w-auto'"
  />
</template>
<script setup>
defineProps({
  id: String,
  name: String,
  modelValue: String,
  fluid: Boolean,
})

const emit = defineEmits(['update:modelValue'])
</script>
