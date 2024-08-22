export const orderByTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const

export type OrderByTypesEnum = typeof orderByTypes[keyof typeof orderByTypes]
