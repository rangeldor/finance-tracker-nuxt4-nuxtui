<script setup lang="ts">
interface IProps {
  amount: number
  lastAmount: number
  title: string | null
  type: string | null
  loading?: boolean
}

const { amount, lastAmount, title, type, loading } = defineProps<IProps>()

const { getFormattedCurrency } = useCurrency()

const isIncome = computed(() => type?.toLowerCase() === 'income')
const titleColor = computed(() => isIncome.value ? 'text-success-600 dark:text-success-500' : 'text-error-600 dark:text-error-500')

const trendingUp = computed(() => amount >= lastAmount) 
const trendingIconName = computed(() => trendingUp.value ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down')
const trendingIconColor = computed(() => trendingUp.value ? 'text-success-600 dark:text-success-500' : 'text-error-600 dark:text-error-500')
const percentageTrend = computed(() => {
  if (amount === 0 || lastAmount === 0) return '∞'

  const bigger = Math.max(amount, lastAmount)
  const lower = Math.min(amount, lastAmount)
  const ratio = ((bigger - lower) / lower) * 100

  return `${Math.ceil(ratio)}`
})
</script>

<template>
  <div>
    <div class="font-bold" :class="titleColor">{{ title }}</div>

    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton class="h-4 w-full" v-if="loading" />
      <div v-else> {{ getFormattedCurrency(amount) }}</div>
    </div>

    <div class="flex items-center text-sm">
      <USkeleton class="h-6 w-full" v-if="loading" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon :name="trendingIconName" class="w-6 h-6" :class="trendingIconColor" />
        <div class="text-gray-500 dark:text-gray-400">
          {{ percentageTrend }}% vs last period
        </div>
      </div>
    </div>
  </div>
</template>
