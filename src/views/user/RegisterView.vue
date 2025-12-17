<template>
  <div class="container mx-auto my-0 w-4/5 translate-x-1/2 fixed">
    <form @submit.prevent="submitHandler()" class="flex flex-col gap-3 my-12 w-96">
      <h1 class="fill-white flex flex-col items-center items-center justify-between">
        <div class="col flex items-center gap-2"><CSLogo /> <span>Manager</span></div>
      </h1>
      <div class="form-group" v-for="val in form" :key="val.id">
        <label :for="val.id">
          {{ val.label }}
        </label>

        <InputText :id="val.id" :name="val.name" :type="val.type" v-model="val.value" fluid />
      </div>

      <ButtonComponent type="submit" label="Отправить" />
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import InputText from '@/components/InputText.vue'
import CSLogo from '@/icons/CSLogo.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { postData } from '@/utils/data/postData'

const toast = useToast()
const router = useRouter()

const form = ref([
  {
    name: 'name',
    id: 'name',
    value: '',
    type: 'text',
    label: 'Имя',
  },
  {
    name: 'email',
    id: 'email',
    value: '',
    type: 'email',
    label: 'Email',
  },
  {
    name: 'password',
    id: 'password',
    value: '',
    type: 'password',
    label: 'Пароль',
  },
  {
    name: 'password_confirmation',
    id: 'password_confirmation',
    value: '',
    type: 'password',
    label: 'Подтверждение пароля',
  },
])

const submitHandler = async () => {
  const payload = Object.fromEntries(form.value.map((item) => [item.name, item.value]))

  try {
    const request = await postData('register', payload)

    if (request.success) {
      toast.success('Регистрация успешна! Теперь вы можете войти.')
      // Redirect to login page after short delay
      setTimeout(() => {
        router.push({ name: 'Login' })
      }, 2000)
    }
  } catch (error) {
    console.error('Registration failed:', error)
    toast.error(error.data?.message || 'Ошибка регистрации. Попробуйте еще раз.')
  }
}
</script>
