<template>
  <UModal
    v-model:open="isOpen"
    :title="isEditing ? 'Edit' : 'Add'"
    :close="{ onClick: () => resetForm() }"
  >
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
            :disabled="isEditing"
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
          <UPopover>
            <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
              {{
                state.created_at
                  ? df.format(state.created_at.toDate(getLocalTimeZone()))
                  : 'Select a date'
              }}
            </UButton>

            <template #content>
              <UCalendar v-model="state.created_at" class="p-2" />
            </template>
          </UPopover>
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
            :loading="isLoading"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone
} from '@internationalized/date'
import { categories, types } from '~/utils/constants'
import type { FormSubmitEvent } from '@nuxt/ui'
import z from 'zod'
import type { ITransaction } from '~/types/transaction'

interface IEmit {
  (e: 'save'): void
}

const df = new DateFormatter('en-US', {
  dateStyle: 'medium'
})

const transaction = defineModel<ITransaction | undefined>('transaction')

const emit = defineEmits<IEmit>()

const { toastError, toastSuccess } = useAppToast()

const isLoading = ref(false)
const isOpen = defineModel<boolean>('isOpen')

const supabase = useSupabaseClient()

const isEditing = computed(() => !!transaction.value)

const defaultSchema = z.object({
  created_at: z.any(),
  description: z.string().optional(),
  amount: z.number().positive('Amount needs to be more than 0')
})

const incomeSchema = z.object({
  type: z.literal('Income')
})
const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum(categories as [string, ...string[]])
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

const today = new Date()
const initialState = {
  type: 'Income' as const,
  amount: 0,
  created_at: shallowRef(
    new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
  ),
  description: '',
  category: undefined
}

const state = reactive<Partial<Schema>>({ ...initialState })

const resetForm = () => {
  Object.assign(state, initialState)
}

const closeModal = () => {
  isOpen.value = false
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true

  try {
    const createdAt = state.created_at
      ? `${state.created_at.year}-${String(state.created_at.month).padStart(2, '0')}-${String(state.created_at.day).padStart(2, '0')}`
      : new Date().toISOString().split('T')[0]

    const { error } = await supabase.from('transactions').upsert({
      ...event.data,
      created_at: createdAt,
      id: transaction.value?.id
    })

    if (!error) {
      toastSuccess({
        title: 'Success',
        description: 'Transaction saved.'
      })
    } else {
      throw error
    }
  } catch (error) {
    toastError({
      title: 'Error',
      description: 'Transaction not saved.'
    })
  } finally {
    isLoading.value = false
  }

  emit('save')
  closeModal()
  resetForm()
}

watch(
  () => transaction.value,
  (newTransaction) => {
    if (newTransaction) {
      const dateStr = (
        newTransaction.created_at || new Date().toISOString()
      ).split('T')[0]!
      const [year, month, day] = dateStr.split('-').map(Number)
      const safeYear = year || today.getFullYear()
      const safeMonth = month || today.getMonth() + 1
      const safeDay = day || today.getDate()

      Object.assign(state, {
        type: (newTransaction.type ?? 'Income') as Schema['type'],
        amount: newTransaction.amount ?? 0,
        created_at: shallowRef(new CalendarDate(safeYear, safeMonth, safeDay)),
        description: newTransaction.description ?? '',
        ...(newTransaction.category && { category: newTransaction.category })
      })
    } else {
      resetForm()
    }
  },
  { immediate: true }
)
</script>
