<template>
  <UForm :state="state" :schema="schema" @submit="onSubmit">
    <UFormField
      label="Transaction View"
      class="mb-4"
      help="Choose how you would like to view transactions"
    >
      <USelect
        v-model="state.transactionView"
        value-key="id"
        :items="transactionItems"
      />
    </UFormField>

    <UButton
      type="submit"
      color="primary"
      variant="solid"
      label="Save"
      :loading="isLoading"
      :disabled="isLoading"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { toastSuccess, toastError } = useAppToast()
const isLoading = ref(false)

const transactionIds = transactionItems.map((item) => item.id) as [
  string,
  ...string[]
]

const schema = z.object({
  transactionView: z.enum(transactionIds)
})

type Schema = z.output<typeof schema>

const state = ref<Partial<Schema>>({
  transactionView:
    user?.value?.user_metadata?.transaction_view ??
    transactionItems[1]?.id ??
    ''
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isLoading.value = true

  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        transaction_view: event.data.transactionView
      }
    })
    if (error) throw error
    toastSuccess({
      title: 'Settings updated'
    })
  } catch (error) {
    toastError({
      title: 'Error updating settings',
      description: 'Please try again.'
    })
  } finally {
    isLoading.value = false
  }
}
</script>
