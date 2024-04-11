import { Factory } from "./factory.js";
import { BaserowSdk } from "./index.js";

export type RowType = Record<string, unknown> & { id: number; order: string };
export type RowOptions<T> = {
  tableId: number;
  rowId: number;
  row: T;
  sdk: BaserowSdk;
  repository: Factory;
};
export abstract class Row<T extends RowType> {
  protected tableId: number;
  protected rowId: number;
  protected row: T;
  protected sdk: BaserowSdk;

  constructor({ tableId, rowId, row, sdk }: RowOptions<T>) {
    this.tableId = tableId;
    this.rowId = rowId;
    this.row = row;
    this.sdk = sdk;
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
}
