import { Table } from "../codegen.js";
import { toCamelCase, capitalizeFirstLetter } from "./toCamelCase.js";

export default function makeRepositoryMethods(tables: Table[]): string {
  return tables
    .map(({ id, name }) => {
      const capitalizedName = capitalizeFirstLetter(name).split('_').map(capitalizeFirstLetter).join('');
      return `    public async getMany${capitalizedName}<T extends ${name}Row>(options: ListRowsOptions = {}): Promise<T[]> {
      return this.getMany<T, ${name}RowType, Repository>(${id}, ${name}Row, options);
    }

    public async getOne${capitalizedName}<T extends ${name}Row>(id: number, options: GetRowOptions = {}): Promise<T> {
        const row = await this.sdk.getRow<${name}RowType>(${id}, id, options);
        const rowClass = this.getRowClass(${id}) || ${name}Row;
        return new rowClass({ tableId: ${id}, rowId: row.id, row, sdk: this.sdk, repository: this }) as T;
    }

    public async addOne${capitalizedName}(row: Omit<${name}RowType, "id" | "order">, options: AddRowOptions = {}): Promise<${name}RowType> {
        return this.sdk.addRow<Omit<${name}RowType, "id" | "order">, ${name}RowType>(${id}, row, options);
    }
`;
    })
    .join("\n");
}
