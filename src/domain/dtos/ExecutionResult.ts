import { PartialFieldValueMapType } from '../types/PartialFieldValueMapType'

export type ExecutionResult = {
  affectedRows: number
}

export type BatchExecutionErrorResult<FieldsEnum extends string> = {
  data: PartialFieldValueMapType<FieldsEnum>[]
  error: Error
}[]
