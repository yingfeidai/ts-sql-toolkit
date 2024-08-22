import { JoinOptionsType } from '../types/JoinOptionsType'
import { WhereOptionsType } from '../types/WhereOptionsType'

export type CountParams<FieldsEnum extends string> = {
  select?: FieldsEnum
  where?: WhereOptionsType<FieldsEnum>[]
  join?: JoinOptionsType[]
}
