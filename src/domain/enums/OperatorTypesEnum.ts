export const operatorTypes = {
  EQUALS: '=',
  NOT_EQUALS: '<>',
  GREATER_THAN: '>',
  LESS_THAN: '<',
  GREATER_THAN_OR_EQUAL: '>=',
  LESS_THAN_OR_EQUAL: '<=',
  LIKE: 'LIKE',
  NOT_LIKE: 'NOT LIKE',
  IN: 'IN',
  NOT_IN: 'NOT IN',
  BINARY: 'BINARY',
} as const

export type OperatorTypesEnum = typeof operatorTypes[keyof typeof operatorTypes]
