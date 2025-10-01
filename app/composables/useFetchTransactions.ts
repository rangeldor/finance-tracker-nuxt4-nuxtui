import type { ITransaction, ITransactionByDate } from '~/types/transaction'

export const useFetchTransactions = () => {
  const supabase = useSupabaseClient()
  const isLoading = ref(false)
  const transactions = ref<ITransaction[]>([])
  const previousTransactions = ref<ITransaction[]>([])

  const getTransactionsByType = (type: string) => {
    return transactions.value.filter((transaction) => transaction.type === type)
  }

  const getCountByType = (type: string) => {
    const transactionsByType = getTransactionsByType(type)

    return transactionsByType.length
  }

  const getAmountTotalByType = (type: string) => {
    return transactions.value.reduce((accumulated, transaction) => {
      if (transaction.type === type) {
        return accumulated + (transaction?.amount ?? 0)
      }
      return accumulated
    }, 0)
  }

  const getDataByType = (type: string | null) => {
    return {
      count: type ? getCountByType(type) : 0,
      amountTotal: type ? getAmountTotalByType(type) : 0
    }
  }

  const getPreviousDataByType = (type: string | null) => {
    const previousAmountTotal = previousTransactions.value.reduce(
      (acc, transaction) => {
        if (transaction.type === type) {
          return acc + (transaction?.amount ?? 0)
        }
        return acc
      },
      0
    )

    return {
      amountTotal: previousAmountTotal
    }
  }

  const fetchTransactions = async (period: ICurrentAndPreviousDates) => {
    isLoading.value = true

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select()
        .gte('created_at', period.current.from.toISOString())
        .lte('created_at', period.current.to.toISOString())
        .order('created_at', { ascending: false })

      if (!error) {
        transactions.value = data ?? []
      }

      const { data: previousData, error: previousError } = await supabase
        .from('transactions')
        .select()
        .gte('created_at', period.previous.from.toISOString())
        .lte('created_at', period.previous.to.toISOString())

      if (!previousError) {
        previousTransactions.value = previousData ?? []
      }
    } finally {
      isLoading.value = false
    }
  }

  const transactionsGroupedByDate = computed<ITransactionByDate>(() => {
    return (transactions.value ?? []).reduce<ITransactionByDate>(
      (acc, transaction) => {
        const date = String(transaction.created_at || new Date()).split('T')[0]
        if (date && !acc[date]) {
          acc[date] = []
        }
        if (date && acc[date]) {
          acc[date].push(transaction)
        }
        return acc
      },
      {}
    )
  })

  return {
    isLoading,
    transactions,
    fetchTransactions,
    transactionsGroupedByDate,
    getDataByType,
    getPreviousDataByType
  }
}
