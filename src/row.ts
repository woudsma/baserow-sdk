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
export class Row<T extends RowType = RowType, R extends Factory = Factory> {
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

  public getField<T>(field: string): T {
    return this.row[field] as T;
  }

  protected async setField(field: string, value: unknown): Promise<void> {
    (this.row as RowType)[field] = value;
    await this.sdk.updateRow(this.tableId, this.rowId, {
      [field]: value,
    });
  }

  protected async setFields(input: Record<string, unknown>): Promise<void> {
    Object.keys(input).forEach((field) => {
      (this.row as RowType)[field] = input[field];
    });
    await this.sdk.updateRow(this.tableId, this.rowId, input);
  }

  protected getLinkedRows<T extends Row, R extends RowType, F extends Factory>(
    tableId: number,
    field: string,
    defaultClass: RowClass<R, F>,
  ): Promise<T[]> {
    return this.repository.getMany(tableId, defaultClass, {
      filters: {
        filter_type: "AND",
        filters: [
          {
            type: "link_row_has",
            field,
            value: this.getId().toString(),
          },
        ],
        groups: [],
      },
    });
  }
}
