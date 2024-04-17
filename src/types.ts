export type FieldValue<T> =
  | T
  | { id: number; value: T }
  | { ids: Record<string, number>; value: T };
