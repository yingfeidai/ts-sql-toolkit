export const joinTypes = {
  INNER: "INNER",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
} as const;

export type JoinTypesEnum = (typeof joinTypes)[keyof typeof joinTypes];
