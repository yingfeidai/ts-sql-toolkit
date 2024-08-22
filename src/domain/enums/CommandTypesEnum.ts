export const commandTypes = {
  SELECT: 'SELECT',
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const

export type CommandTypesEnum = typeof commandTypes[keyof typeof commandTypes]
