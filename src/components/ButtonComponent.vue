<template>
  <button
    @click="emit('click')"
    :type="type"
    class="hover:cursor-pointer dark:hover:bg-white/20 transition-all ease-in duration-300 px-6 py-3"
    :class="rounded ? 'rounded-full' : 'rounded'"
  >
    {{ label }}
    <span class="loader" v-if="loading"></span>
  </button>
</template>
<script setup>
const emit = defineEmits(['click'])

defineProps({
  type: String,
  label: String,
  loading: Boolean,
  rounded: Boolean,
})
</script>
<style scoped>
.loader {
  width: 16px;
  height: 16px;
  border: 5px solid #fff;
  border-bottom-color: #ff3d00;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
