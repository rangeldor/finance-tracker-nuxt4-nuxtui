<template>
  <div
    class="grid grid-cols-2 border-b border-gray-200 py-4 font-bold text-gray-500 dark:border-gray-800 dark:text-gray-400"
  >
    <div class="flex items-center justify-between">
      {{ date }}
    </div>

    <div class="mr-10 flex items-center justify-end">
      {{ currency }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITransaction } from '~/types/transaction'

interface IProps {
  date: string | number
  transactions: ITransaction[]
}

const { date, transactions } = defineProps<IProps>()
const { getFormattedCurrency } = useCurrency()

const currency = computed(() => {
  let sum = 0

  for (const transaction of transactions) {
    if (transaction.type === 'Income') {
      sum += transaction?.amount ?? 0
    } else {
      sum -= transaction?.amount ?? 0
    }
  }

  return getFormattedCurrency(sum)
})
</script>
