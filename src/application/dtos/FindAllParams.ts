import { JoinOptionsType } from '../../domain/types/JoinOptionsType'
import { OrderByOptionsType } from '../../domain/types/OrderByOptionsType'
import { WhereOptionsType } from '../../domain/types/WhereOptionsType'

export type FindAllParams<FieldsEnum> = {
  where?: WhereOptionsType<FieldsEnum>[]
  select?: FieldsEnum[]
  join?: JoinOptionsType[]
  orderBy?: OrderByOptionsType<FieldsEnum>[]
  groupBy?: FieldsEnum[]
}
