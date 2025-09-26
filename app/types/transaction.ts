import type { Database } from '~/types/database.types'

export type ITransaction = Database['public']['Tables']['transactions']['Row']

export interface ITransactionByDate {
  [date: string]: ITransaction[]
}