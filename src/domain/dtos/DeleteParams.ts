import { WhereOptionsType } from "../types/WhereOptionsType";

export type DeleteParams<FieldsEnum extends string> = {
  where: WhereOptionsType<FieldsEnum>[];
};
