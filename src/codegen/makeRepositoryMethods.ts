import { Table } from "../codegen.js";

export default function makeRepositoryMethods(tables: Table[]): string {
  return tables
    .map(({ id, name }) => {
      return `    public async getMany${name}(options: ListRowsOptions = {}): Promise<${name}Row[]> {
        const {results} = await this.sdk.listRows<${name}RowType>(${id}, options);
        return results.map((row) => new ${name}Row({tableId: ${id}, rowId: row.id, row, sdk: this.sdk, repository: this}));
    }

    public async getOne${name}(id: number, options: GetRowOptions = {}): Promise<${name}Row> {
        const row = await this.sdk.getRow<${name}RowType>(${id}, id, options);
        return new ${name}Row({tableId: ${id}, rowId: row.id, row, sdk: this.sdk, repository: this});
    }
`;
    })
    .join("\n");
}
