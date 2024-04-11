import { BaserowConfig, getConfig } from "./getConfig.js";
import { BaserowSdk } from "./index.js";
import { Row, RowOptions, RowType } from "./row.js";

interface RowClass<T extends RowType, R extends Factory> {
  new (options: RowOptions<T, R>): Row<T, R>;
}

export abstract class Factory {
  public readonly config: BaserowConfig;

  protected sdk: BaserowSdk;
  protected classes: Map<number, RowClass<RowType, Factory>> = new Map();

  constructor() {
    this.config = getConfig();
    if (!this.config.databaseToken) {
      throw new Error("Missing database token in configuration");
    }
    this.sdk = new BaserowSdk(this.config.databaseToken);
  }

  protected registerRowClass<T extends RowType, R extends Factory>(
    tableId: number,
    rowClass: RowClass<T, R>,
  ): void {
    this.classes.set(tableId, rowClass as RowClass<RowType, Factory>);
  }

  protected getRowClass<T extends RowType, R extends Factory>(
    tableId: number,
  ): RowClass<T, R> | undefined {
    return this.classes.get(tableId) as RowClass<T, R> | undefined;
  }
}
