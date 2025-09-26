<template>
  <section class="flex items-center justify-between mb-10">    
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu v-model="selectedTransactionItem" :items="transactionItems" value-key="id" class="w-48" />
    </div>
  </section>

  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10" >
    <div 
      v-for="transaction in transactions" 
      :key="transaction.id"
      >
      <Trend      
        :amount="getDataByType(transaction.type).amountTotal" 
        :last-amount="getPreviousDataByType(transaction.type).amountTotal" 
        :type="transaction.type" 
        :title="transaction.description" 
        :loading="isLoading" 
       />
    </div>
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ getDataByType('Income').count }} incomes and {{ getDataByType('Expense').count }} expenses this period
      </div>
    </div>
    <div>
      <TransactionModal @save="getTransactions()" />   
    </div>
  </section>

  <section v-if="!isLoading">
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
        :isLoading="isLoading" 
        @delete="getTransactions()"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script lang="ts" setup>
const selectedTransactionItem = ref(transactionItems[1]?.id)
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

onMounted(() => {
  getTransactions()
})

watch(selectedTransactionItem, () => {
  getTransactions()
})
</script>
