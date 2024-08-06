import { DeleteParams } from "../../domain/dtos/DeleteParams";
import { InsertParams } from "../../domain/dtos/InsertParams";

export type ReplaceParams<FieldsEnum extends string> = {
  delete: DeleteParams<FieldsEnum>;
  create: InsertParams<FieldsEnum>;
};
