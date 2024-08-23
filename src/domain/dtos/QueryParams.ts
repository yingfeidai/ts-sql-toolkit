import { JoinOptionsType } from '../types/JoinOptionsType'
import { OrderByOptionsType } from '../types/OrderByOptionsType'
import { PaginationOptionsType } from '../types/PaginationOptionsType'
import { WhereOptionsType } from '../types/WhereOptionsType'

export type QueryParams<FieldsEnum extends string> = {
  select?: FieldsEnum[]
  where?: WhereOptionsType<FieldsEnum>[]
  pagination?: PaginationOptionsType
  join?: JoinOptionsType[]
  orderBy?: OrderByOptionsType<FieldsEnum>[]
  groupBy?: FieldsEnum[]
}
