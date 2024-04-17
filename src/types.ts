import { Factory } from "./factory.js";
import { Row, RowOptions, RowType } from "./row.js";

export type FieldValue<T> =
  | T
  | { id: number; value: T }
  | { ids: Record<string, number>; value: T };

export interface RowClass<
  T extends RowType = RowType,
  R extends Factory = Factory,
> {
  new (options: RowOptions<T, R>): Row<T, R>;
}
