import { Factory } from "./factory.js";
import { BaserowSdk, RowClass } from "./index.js";

export type RowType = Record<string, unknown> & { id: number; order: string };
export type RowOptions<T extends RowType, R extends Factory> = {
  tableId: number;
  rowId: number;
  row: T;
  sdk: BaserowSdk;
  repository: R;
};
export abstract class Row<
  T extends RowType = RowType,
  R extends Factory = Factory,
> {
  protected tableId: number;
  protected rowId: number;
  protected row: T;
  protected sdk: BaserowSdk;
  protected repository: Factory;

  constructor({ tableId, rowId, row, sdk, repository }: RowOptions<T, R>) {
    this.tableId = tableId;
    this.rowId = rowId;
    this.row = row;
    this.sdk = sdk;
    this.repository = repository;
  }

  public getRow(): T {
    return this.row;
  }

  public getId(): number {
    return this.row.id;
  }

  public getOrder(): number {
    return parseFloat(this.row.order);
  }

  protected getField<T>(field: string): T {
    return this.row[field] as T;
  }

  protected async setField(field: string, value: unknown): Promise<void> {
    (this.row as RowType)[field] = value;
    await this.sdk.updateRow(this.tableId, this.rowId, {
      [field]: value,
    });
  }

  protected getLinkedRows<T extends Row, R extends RowType, F extends Factory>(
    tableId: number,
    fieldId: number,
    defaultClass: RowClass<R, F>,
  ): Promise<T[]> {
    return this.repository.getMany(tableId, defaultClass, {
      user_field_names: false,
      filters: {
        filter_type: "AND",
        filters: [
          {
            type: "link_row_has",
            field: fieldId,
            value: this.getId().toString(),
          },
        ],
        groups: [],
      },
    });
  }
}
