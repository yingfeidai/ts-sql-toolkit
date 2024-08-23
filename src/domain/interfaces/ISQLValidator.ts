import { InsertParams } from '../dtos/InsertParams'
import { UpdateParams } from '../dtos/UpdateParams'
import { DeleteParams } from '../dtos/DeleteParams'
import { QueryParams } from '../dtos/QueryParams'
import { CountParams } from '../dtos/CountParams'

export interface ISQLValidator<FieldsEnum extends string> {
  validateSelect(params: QueryParams<FieldsEnum>): void
  validateCount(params: CountParams<FieldsEnum>): void
  validateInsert(params: InsertParams<FieldsEnum>): void
  validateUpdate(params: UpdateParams<FieldsEnum>): void
  validateDelete(params: DeleteParams<FieldsEnum>): void
}
