import { PartialFieldValueMapType } from "../types/PartialFieldValueMapType";

export type InsertParams<FieldsEnum extends string> = {
  data: PartialFieldValueMapType<FieldsEnum>[];
};
