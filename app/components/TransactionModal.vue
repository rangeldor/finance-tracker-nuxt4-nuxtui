<template>
  <UModal
    v-model:open="isOpen"
    title="Add Transaction"
    :close="{ onClick: () => resetForm() }"
  >
    <UButton
      icon="i-heroicons-plus-circle"
      color="primary"
      variant="solid"
      label="Add"
      @click="isOpen = true"
    />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          :required="true"
          label="Transaction Type"
          name="type"
          class="mb-4"
        >
          <USelect
            v-model="state.type"
            placeholder="Select the transaction type"
            :items="types"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Amount" :required="true" name="amount" class="mb-4">
          <UInput
            v-model="state.amount"
            type="number"
            placeholder="Amount"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Transaction date"
          :required="true"
          name="created_at"
          class="mb-4"
        >
          <UInput
            v-model="state.created_at"
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Description"
          hint="Optional"
          name="description"
          class="mb-4"
        >
          <UInput
            v-model="state.description"
            placeholder="Description"
            class="w-full"
          />
        </UFormField>

        <UFormField
          v-if="state.type === 'Expense'"
          :required="true"
          label="Category"
          name="category"
          class="mb-4"
        >
          <USelect
            v-model="state.category"
            placeholder="Category"
            :items="categories"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end">
          <UButton
            type="submit"
            label="Save"
            color="primary"
            :loading="insLoading"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { categories, types } from '~/utils/constants'
import type { FormSubmitEvent } from '@nuxt/ui'
import z from 'zod'

interface IEmit {
  (e: 'save'): void
}
const emit = defineEmits<IEmit>()

const insLoading = ref(false)
const supabase = useSupabaseClient()

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive('Amount needs to be more than 0')
})

const incomeSchema = z.object({
  type: z.literal('Income')
})
const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum(categories)
})
const investmentSchema = z.object({
  type: z.literal('Investment')
})
const savingSchema = z.object({
  type: z.literal('Saving')
})

const schema = z.intersection(
  z.discriminatedUnion('type', [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema
  ]),
  defaultSchema
)

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined
})

const initialState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined
}

const isOpen = ref(false)

const resetForm = () => {
  Object.assign(state, initialState)
}

const closeModal = () => {
  isOpen.value = false
}

const savedTransactionToast = () => {
  toast.add({
    title: 'Success',
    icon: 'i-heroicons-check-circle',
    description: 'Transaction saved.',
    color: 'success'
  })
}

const errorTransactionToast = () => {
  toast.add({
    title: 'Error',
    description: 'Transaction not saved.',
    icon: 'i-heroicons-x-circle',
    color: 'error'
  })
}

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  insLoading.value = true

  try {
    const { error } = await supabase.from('transactions').upsert(event.data)

    if (!error) {
      savedTransactionToast()
    } else {
      throw error
    }
  } catch (error) {
    errorTransactionToast()
  } finally {
    insLoading.value = false
  }

  emit('save')
  closeModal()
  resetForm()
}
</script>
