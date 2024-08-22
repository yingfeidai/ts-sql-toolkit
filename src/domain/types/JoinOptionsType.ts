import { JoinTypesEnum } from '../enums/JoinTypesEnum'

export type JoinOptionsType = {
  table: string
  on: string
  type?: JoinTypesEnum
}
