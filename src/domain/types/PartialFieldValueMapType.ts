export type FieldValueType = string | number | boolean | Date;

export type PartialFieldValueMapType<FieldEnum extends string> = Partial<
  Record<FieldEnum, FieldValueType>
>;
