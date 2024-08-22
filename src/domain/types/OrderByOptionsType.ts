import { OrderByTypesEnum } from '../enums/OrderByTypesEnum'

export type OrderByOptionsType<T> = {
  field: T
  direction?: OrderByTypesEnum
}
