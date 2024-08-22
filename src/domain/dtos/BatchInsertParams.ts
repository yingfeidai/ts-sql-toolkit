import { InsertParams } from "./InsertParams";

export type BatchInsertParams<FieldsEnum extends string> =
  InsertParams<FieldsEnum> & {
    batchSize: number;
  };
