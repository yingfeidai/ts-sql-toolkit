import { OperatorTypesEnum } from "../enums/OperatorTypesEnum";

export type ConditionValueType<Operator extends OperatorTypesEnum> =
  Operator extends "LIKE" | "ILIKE" | "NOT LIKE" | "NOT ILIKE"
    ? string
    : Operator extends "IN" | "NOT IN"
    ? any[]
    : Operator extends "IS NOT NULL" | "IS NULL"
    ? never
    : Operator extends "BETWEEN" | "NOT BETWEEN"
    ? [any, any]
    : Operator extends
        | "GREATER_THAN"
        | "LESS_THAN"
        | "GREATER_THAN_OR_EQUAL"
        | "LESS_THAN_OR_EQUAL"
    ? number
    : Operator extends "IN SUBQUERY" | "NOT IN SUBQUERY"
    ? never
    : Operator extends "ANY" | "SOME" | "ALL"
    ? any[]
    : any;
