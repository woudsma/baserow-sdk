import { BaserowConfig, getConfig } from "./getConfig.js";
import { BaserowSdk } from "./index.js";
import { Row, RowOptions, RowType } from "./row.js";

interface RowClass {
  new (options: RowOptions<RowType>): Row<RowType>;
}

export abstract class Factory {
  protected sdk: BaserowSdk;
  protected config: BaserowConfig;
  protected classes: Map<number, RowClass> = new Map();

  constructor() {
    this.config = getConfig();
    this.sdk = new BaserowSdk(this.config.databaseToken);
  }

  protected registerRowClass(tableId: number, rowClass: RowClass): void {
    this.classes.set(tableId, rowClass);
  }

  protected getRowClass(tableId: number): RowClass | undefined {
    return this.classes.get(tableId);
  }
}
