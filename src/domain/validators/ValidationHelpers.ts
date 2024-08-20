import { joinTypes, JoinTypesEnum } from "../enums/JoinTypesEnum";
import { orderByTypes, OrderByTypesEnum } from "../enums/OrderByTypesEnum";
import { IFieldValidator } from "../interfaces/IFieldValidator";
import { IOperatorValidator } from "../interfaces/IOperatorValidator";
import { IValueValidator } from "../interfaces/IValueValidator";
import { JoinOptionsType } from "../types/JoinOptionsType";
import { OrderByOptionsType } from "../types/OrderByOptionsType";
import { PaginationOptionsType } from "../types/PaginationOptionsType";
import { PartialFieldValueMapType } from "../types/PartialFieldValueMapType";
import { WhereOptionsType } from "../types/WhereOptionsType";


export const validateWhereOptions = <FieldsEnum extends string>(
  where: WhereOptionsType<FieldsEnum>[],
  fieldValidator: IFieldValidator,
  operatorValidator: IOperatorValidator,
  valueValidator: IValueValidator
): void => {
  where.forEach(condition => {
    if (condition.field) {
      fieldValidator.validateFields([condition.field]);
    }
    if (condition.operator) {
      operatorValidator.validateOperators([condition.operator]);
    }
    if (condition.value !== undefined) {
      valueValidator.validateValues([condition.value]);
    }
  });
};

export const validateJoinOptions = (
  joinOptions: JoinOptionsType[],
  fieldValidator: IFieldValidator
): void => {
  joinOptions.forEach(join => {
    if (join.type && !isValidJoinType(join.type)) {
      throw new Error(`Invalid join type: ${join.type}`);
    }
    if (join.table) {
      fieldValidator.validateFields([join.table]);
    }
    Object.entries(join.on).forEach(([key, value]) => {
      fieldValidator.validateFields([key, value]);
    });
  });
};

export const validatePagination = (pagination: PaginationOptionsType): void => {
  if (pagination.limit !== undefined && pagination.limit <= 0) {
    throw new Error(`Invalid pagination limit: ${pagination.limit}`);
  }
  if (pagination.offset !== undefined && pagination.offset < 0) {
    throw new Error(`Invalid pagination offset: ${pagination.offset}`);
  }
};

export const validateOrderByOptions = <FieldsEnum extends string>(
  orderByOptions: OrderByOptionsType<FieldsEnum>[],
  fieldValidator: IFieldValidator
): void => {
  orderByOptions.forEach(orderBy => {
    if (orderBy.field) {
      fieldValidator.validateFields([orderBy.field]);
    }
    if (orderBy.direction && !isValidOrderDirection(orderBy.direction)) {
      throw new Error(`Invalid order by direction: ${orderBy.direction}`);
    }
  });
};

export const validateData = <FieldsEnum extends string>(
  data: PartialFieldValueMapType<FieldsEnum>[],
  fieldValidator: IFieldValidator,
  valueValidator: IValueValidator
): void => {
  data.forEach(entry => {
    Object.entries(entry).forEach(([field, value]) => {
      fieldValidator.validateFields([field as FieldsEnum]);
      if (value !== undefined) {
        valueValidator.validateValues([value]);
      }
    });
  });
};

const isValidJoinType = (joinType: string): joinType is JoinTypesEnum => {
  return Object.values(joinTypes).includes(joinType as JoinTypesEnum);
};

const isValidOrderDirection = (direction: string): direction is OrderByTypesEnum => {
  return Object.values(orderByTypes).includes(direction as OrderByTypesEnum);
};
