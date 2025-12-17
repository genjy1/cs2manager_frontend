<template><div class="container mx-auto my-12"></div></template>
<script setup>
import { getData } from '@/utils/data/getData'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const player = ref({})
const route = useRoute()
const id = ref(route.params.id)

const getPlayer = async (id) => {
  const response = await getData(`player/${id}/get`)

  player.value = response
}

onMounted(async () => {
  await getPlayer(id.value)

  console.log(player.value)
})
</script>
