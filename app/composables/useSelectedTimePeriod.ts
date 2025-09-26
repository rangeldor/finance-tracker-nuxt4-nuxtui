import { startOfYear, endOfYear, sub, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns'

export interface ICurrentAndPreviousDates {
        current: {
            from: Date,
            to: Date
        },
        previous: {
            from: Date,
            to: Date
        }
    }
interface ISelectedTimePeriod {
    getDateByPeriod(period: string | undefined) : ICurrentAndPreviousDates
}

const dateByPeriod = {
    yearly: {
            current: {
                from: startOfYear(new Date()),
                to: endOfYear(new Date())
            },
            previous: {
                from: startOfYear(sub(new Date(), { years: 1 })),
                to: endOfYear(sub(new Date(), { years: 1 }))
            }
            },
    monthly: {
            current: {
                from: startOfMonth(new Date()),
                to: endOfMonth(new Date())
            },
            previous: {
                from: startOfMonth(sub(new Date(), { months: 1 })),
                to: endOfMonth(sub(new Date(), { months: 1 }))
            }
            },
    daily: {
            current: {
                from: startOfDay(new Date()),
                to: endOfDay(new Date())
            },
            previous: {
                from: startOfDay(sub(new Date(), { days: 1 })),
                to: endOfDay(sub(new Date(), { days: 1 }))
            }
    },
    default: {
            current: {
                from: startOfMonth(new Date()),
                to: endOfMonth(new Date())
            },
            previous: {
                from: startOfMonth(sub(new Date(), { months: 1 })),
                to: endOfMonth(sub(new Date(), { months: 1 }))
            }
            }
}

export const useSelectedTimePeriod = (): ISelectedTimePeriod => {
    const getDateByPeriod = (period: string | undefined): ICurrentAndPreviousDates => {
        const key = period as 'yearly' | 'monthly' | 'daily' | 'default'
        return dateByPeriod[key] || dateByPeriod.default
    }

    return {
        getDateByPeriod
    }
}