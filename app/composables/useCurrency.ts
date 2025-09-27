interface ICurrency {
  getFormattedCurrency: (
    amount: number,
    locales?: string,
    currency?: string,
    maximumFractionDigits?: number
  ) => string
}

export const useCurrency = (): ICurrency => {
  const getFormattedCurrency = (
    amount: number,
    locales = 'pt-BR',
    currency = 'BRL',
    maximumFractionDigits = 2
  ): string => {
    return new Intl.NumberFormat(locales, {
      style: 'currency',
      currency,
      maximumFractionDigits
    }).format(amount)
  }

  return {
    getFormattedCurrency
  }
}
