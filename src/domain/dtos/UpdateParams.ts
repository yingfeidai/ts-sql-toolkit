import { PartialFieldValueMapType } from "../types/PartialFieldValueMapType";
import { WhereOptionsType } from "../types/WhereOptionsType";

export type UpdateParams<FieldsEnum extends string> = {
  data: PartialFieldValueMapType<FieldsEnum>;
  where: WhereOptionsType<FieldsEnum>[];
};
