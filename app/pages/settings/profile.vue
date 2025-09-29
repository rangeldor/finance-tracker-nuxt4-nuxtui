<template>
  <UForm :state="state" :schema="schema" class="space-y-4" @submit="onSubmit">
    <UFormField class="mb-4" label="Full Name" name="name">
      <UInput v-model="state.name" class="w-full" />
    </UFormField>

    <UFormField
      class="mb-4"
      label="Email"
      name="email"
      help="You will receive a confirmation email on both the old and the new addresses if you modify the email address"
    >
      <UInput v-model="state.email" class="w-full" />
    </UFormField>

    <UButton
      type="submit"
      color="primary"
      variant="solid"
      label="Save"
      :loading="isLoading"
      :disable="isLoading"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { toastSuccess, toastError } = useAppToast()

const pending = ref(false)
const isLoading = ref(false)

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email()
})

type Schema = z.output<typeof schema>

const state = ref<Partial<Schema>>({
  name: user?.value?.user_metadata?.full_name ?? '',
  email: user?.value?.email ?? ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true

  try {
    const data = {
      email:
        event.data.email !== user?.value?.email ? event.data.email : undefined,
      data: {
        full_name: event.data.name
      }
    }

    const { error } = await supabase.auth.updateUser(data)
    if (!error) {
      toastSuccess({
        title: 'Success',
        description: 'Profile saved.'
      })
    } else {
      throw error
    }
  } catch (error) {
    toastError({
      title: 'Error',
      description: 'Profile not saved.'
    })
  } finally {
    isLoading.value = false
  }
}
</script>
