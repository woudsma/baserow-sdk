import { BaserowConfig, getConfig } from "./getConfig.js";
import { BaserowSdk, RowClass } from "./index.js";
import { Row, RowType } from "./row.js";

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

  public async getMany<T extends Row, R extends RowType, F extends Factory>(
    tableId: number,
    defaultClass: RowClass<R, F>,
    options: Record<string, unknown> = {},
  ): Promise<T[]> {
    const { results } = await this.sdk.listRows<R>(tableId, options);
    const rowClass = this.getRowClass(tableId) || defaultClass;
    return results.map(
      (row) =>
        new rowClass({
          tableId,
          rowId: row.id,
          row,
          sdk: this.sdk,
          repository: this as unknown as F,
        }),
    ) as T[];
  }
}
