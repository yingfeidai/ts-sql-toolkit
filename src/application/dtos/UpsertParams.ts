import { InsertParams } from '../../domain/dtos/InsertParams'
import { UpdateParams } from '../../domain/dtos/UpdateParams'
import { FindOneParams } from './FindOneParams'

export type UpsertParams<FieldsEnum extends string> = {
  find: FindOneParams<FieldsEnum>
  create: InsertParams<FieldsEnum>
  update: UpdateParams<FieldsEnum>
}
