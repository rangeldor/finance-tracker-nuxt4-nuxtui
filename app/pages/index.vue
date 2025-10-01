<template>
  <div>
    <section class="container mx-auto my-10 flex items-center justify-between">
      <h1 class="text-4xl font-extrabold">Summary</h1>
      <div>
        <USelectMenu
          v-model="selectedTransactionItem"
          :items="transactionItems"
          value-key="id"
          class="w-48"
        />
      </div>
    </section>

    <section
      class="container mx-auto mb-10 grid grid-cols-1 sm:grid-cols-2 sm:gap-16 lg:grid-cols-4"
    >
      <div v-for="transaction in transactions" :key="transaction.id">
        <Trend
          :amount="getDataByType(transaction.type).amountTotal"
          :last-amount="getPreviousDataByType(transaction.type).amountTotal"
          :type="transaction.type"
          :title="transaction.description"
          :loading="isLoading"
        />
      </div>
    </section>

    <section class="container mx-auto mb-10 flex justify-between">
      <div>
        <h2 class="text-2xl font-extrabold">Transactions</h2>
        <div class="text-gray-500 dark:text-gray-400">
          You have {{ getDataByType('Income').count }} incomes and
          {{ getDataByType('Expense').count }} expenses this period
        </div>
      </div>
      <div>
        <UButton
          icon="i-heroicons-plus-circle"
          color="primary"
          variant="solid"
          label="Add"
          @click="saveTransaction()"
        />
        <TransactionModal
          v-model:is-open="showModal"
          v-model:transaction="selectedTransaction"
          @save="getTransactions()"
        />
      </div>
    </section>

    <section v-if="!isLoading" class="container mx-auto">
      <div
        v-for="(transactionsOnDay, date) in transactionsGroupedByDate"
        :key="date"
        class="mb-10"
      >
        <DailyTransactionSummary
          :date="date"
          :transactions="transactionsOnDay"
        />
        <Transaction
          v-for="transaction in transactionsOnDay"
          :key="transaction.id"
          :transaction="transaction"
          @delete="getTransactions()"
          @edit="editTransaction"
        />
      </div>
    </section>
    <section v-else class="container mx-auto">
      <USkeleton v-for="i in 4" :key="i" class="mb-2 h-8 w-full" />
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { ITransaction } from '~/types/transaction'

const user = useSupabaseUser()
const selectedTransactionItem = ref(
  user?.value?.user_metadata?.transaction_view ?? transactionItems[1]
)
const showModal = ref(false)
const selectedTransaction = ref<ITransaction | undefined>()

const { getDateByPeriod } = useSelectedTimePeriod()

const {
  fetchTransactions,
  transactions,
  transactionsGroupedByDate,
  isLoading,
  getDataByType,
  getPreviousDataByType
} = useFetchTransactions()

const getTransactions = () => {
  const period = getDateByPeriod(selectedTransactionItem.value)
  fetchTransactions(period)
}

const editTransaction = (transaction: ITransaction) => {
  selectedTransaction.value = transaction
  showModal.value = true
}

const saveTransaction = () => {
  selectedTransaction.value = undefined
  showModal.value = true
}

onMounted(() => {
  getTransactions()
})

watch(selectedTransactionItem, () => {
  getTransactions()
})
</script>
