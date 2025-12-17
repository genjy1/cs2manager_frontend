<template>
  <div class="fixed inset-0 flex justify-center pt-12">
    <form @submit.prevent="submitHandler" class="flex flex-col gap-3 w-96">
      <h1 class="fill-white flex flex-col items-center justify-between">
        <div class="flex items-center gap-2">
          <CSLogo />
          <span>Manager</span>
        </div>
      </h1>

      <div class="form-group flex flex-col" v-for="val in form" :key="val.name">
        <label :for="val.id">{{ val.label }}</label>
        <InputText :id="val.id" :name="val.name" :type="val.type" v-model="val.value" />
      </div>

      <ButtonComponent label="Войти" type="submit" />
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { postData } from '@/utils/data/postData'
import InputText from '@/components/InputText.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import CSLogo from '@/icons/CSLogo.vue'
import router from '@/router'

const form = ref([
  { name: 'name', id: 'name', value: '', type: 'text', label: 'Имя' },
  { name: 'password', id: 'password', value: '', type: 'password', label: 'Пароль' },
])

const submitHandler = async () => {
  const payload = Object.fromEntries(form.value.map((item) => [item.name, item.value]))

  const request = await postData('login', payload)

  if (request.success) {
    localStorage.setItem('access_token', request.token)
    router.push({ name: 'Dashboard' })
  }

  console.log('SEND:', payload)
  console.log('sent', request)
}
</script>
