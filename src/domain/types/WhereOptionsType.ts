import { OperatorTypesEnum } from "../enums/OperatorTypesEnum";
import { ConditionValueType } from "./ConditionValueType";

export type WhereOptionsType<T> = {
  field: T;
  value: ConditionValueType<OperatorTypesEnum>;
  operator?: OperatorTypesEnum;
};
