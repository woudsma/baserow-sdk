import { BaserowConfig, getConfig } from "./getConfig.js";
import { BaserowSdk } from "./index.js";
import { Row, RowOptions, RowType } from "./row.js";

interface RowClass<T extends RowType> {
  new (options: RowOptions<T>): Row<T>;
}

export abstract class Factory {
  protected sdk: BaserowSdk;
  protected config: BaserowConfig;
  protected classes: Map<number, RowClass<RowType>> = new Map();

  constructor() {
    this.config = getConfig();
    this.sdk = new BaserowSdk(this.config.databaseToken);
  }

  protected registerRowClass<T extends RowType>(
    tableId: number,
    rowClass: RowClass<T>,
  ): void {
    this.classes.set(tableId, rowClass as RowClass<RowType>);
  }

  protected getRowClass<T extends RowType>(
    tableId: number,
  ): RowClass<T> | undefined {
    return this.classes.get(tableId) as RowClass<T> | undefined;
  }
}
