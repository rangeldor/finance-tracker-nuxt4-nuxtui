<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { ITransaction } from '~/types/transaction';

interface IProps {
  transaction: ITransaction
  isLoading: boolean
}

interface IEmit {
  (e: 'delete', id: number): void
}

const { transaction } = defineProps<IProps>()

const { getFormattedCurrency } = useCurrency()
const toast = useToast()

const emit = defineEmits<IEmit>()

const isIncome = computed(() => transaction.type?.toLowerCase() === 'income')
const icon = computed(() => isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-right')
const iconColor = computed(() => isIncome.value ? 'text-success-600' : 'text-error-600')
const isLoading = ref(false)
const supabase = useSupabaseClient()

const deleteTransaction = async () => {
  isLoading.value = true
  try {
    await supabase
      .from('transactions')
      .delete()
      .eq('id', transaction.id)
        
    toast.add({
      title: 'Success deleting transaction',
      icon: 'i-heroicons-check-circle-20-solid',
      description: 'The transaction has been successfully deleted.',
      color: 'success',
      duration: 3000
    })

    emit('delete', transaction.id)
  } catch (error) {
    toast.add({
      title: 'Error deleting transaction',
      icon: 'i-heroicons-exclamation-circle-20-solid',
      description: 'The transaction has been successfully deleted.',
      color: 'error',
      duration: 3000
    })
  } finally {
    isLoading.value = false
  }
}

const items = ref<DropdownMenuItem[]>([
  {
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    onSelect: () => {
      console.log('Edit clicked')
    }
  },
  {
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    onSelect: () => {
      deleteTransaction()      
    }
  }
])
</script>

<template>
  <div class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
    <div class="flex items-center justify-between space-x-4 col-span-2">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="iconColor" />
        <div>{{ transaction.description }}</div>
      </div>
      <div>
        <UBadge color="neutral" variant="outline" v-if="transaction.category">{{ transaction.category }}</UBadge>
      </div>
    </div>

  <div class="flex items-center justify-end space-x-2">
    <div>{{ transaction.amount !== null ? getFormattedCurrency(transaction.amount) : 'N/A' }} </div>
    <div>
      <UDropdownMenu
        arrow
        :items="items"
        :ui="{
          content: 'w-48'
        }"
      >
        <UButton 
          trailing-icon="i-heroicons-ellipsis-horizontal" 
          color="neutral" 
          variant="ghost" 
          :loading="isLoading"          
        />
      </UDropdownMenu>
    </div>
  </div>
  </div>
</template>
