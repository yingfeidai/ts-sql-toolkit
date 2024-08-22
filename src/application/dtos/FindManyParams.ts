import { JoinOptionsType } from "../../domain/types/JoinOptionsType";
import { OrderByOptionsType } from "../../domain/types/OrderByOptionsType";
import { PaginationOptionsType } from "../../domain/types/PaginationOptionsType";
import { WhereOptionsType } from "../../domain/types/WhereOptionsType";

export type FindManyParams<FieldsEnum> = {
  where?: WhereOptionsType<FieldsEnum>[];
  select?: FieldsEnum[];
  pagination?: PaginationOptionsType;
  join?: JoinOptionsType[];
  orderBy?: OrderByOptionsType<FieldsEnum>[];
  groupBy?: FieldsEnum[];
};
