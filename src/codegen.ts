import rc from "rc";
import { BaserowSdk } from "./index.js";
import z from "zod";
import fs from "fs";
import makeType from "./codegen/makeType.js";
import makeClassMethods from "./codegen/makeClassMethods.js";
import path from "path";

export default async function main(): Promise<void> {
  const raw = rc("baserow");
  const config = z
    .object({
      url: z.string(),
      tables: z.record(z.string(), z.number()),
      databaseToken: z.string(),
      outDir: z.string(),
      config: z.string(),
    })
    .parse(raw);

  console.log("Hello from codegen.ts");
  console.dir(config);

  const outDir = path.join(path.dirname(config.config), config.outDir);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const sdk = new BaserowSdk(String(config.databaseToken));

  const tables = await Promise.all(
    Object.entries(config.tables).map(async ([name, id]) => {
      return {
        name,
        id,
        fields: await sdk.listFields(id),
      };
    }),
  );

  tables.map((table) => {
    console.log(table);
    const tableName = table.name;
    const fields = table.fields;
    const foreignTables = fields
      .filter((field) => !!field.link_row_table_id)
      .map((field) =>
        tables.find((table) => table.id === field.link_row_table_id),
      )
      .filter((t) => !!t);

    //TODO: this may not be correct for all generated files
    const typeDef = `export type ${tableName}RowType = ${makeType(fields)}

import { Row } from "../src/row.ts";
import { Repository } from "./Repository.ts";
import { BaserowSdk } from "../src/index.ts";
${foreignTables
  .map((t) => {
    return `import { ${t?.name}Row } from "./${t?.name}.ts";`;
  })
  .join("\n")}

export class ${tableName}Row extends Row<${tableName}RowType> {
  private repository: Repository;
  constructor(options: {
    tableId: number;
    rowId: number;
    row: ${tableName}RowType;
    sdk: BaserowSdk;
    repository: Repository;
  }) {
    super(options);
    this.repository = options.repository;
  }
  ${makeClassMethods(table.id, tables)}
}`;

    fs.writeFileSync(`${outDir}/${tableName}.ts`, typeDef);
  });

  const factoryCode = `import { Factory } from '../src/factory.ts'
import { ListRowsOptions, GetRowOptions } from '../src/index.ts'
${Object.keys(config.tables)
  .map(
    (tableName) =>
      `import { ${tableName}Row, ${tableName}RowType } from './${tableName}.ts';`,
  )
  .join("\n")}
export class Repository extends Factory {
    ${Object.keys(config.tables)
      .map(
        (tableName) =>
          `public async getMany${tableName}(options: ListRowsOptions = {}): Promise<${tableName}Row[]> {
        const {results} = await this.sdk.listRows<${tableName}RowType>(${config.tables[tableName]}, options);
        return results.map((row) => new ${tableName}Row({tableId: ${config.tables[tableName]}, rowId: row.id, row, sdk: this.sdk, repository: this}));
    }
    public async getOne${tableName}(id: number, options: GetRowOptions = {}): Promise<${tableName}Row> {
        const row = await this.sdk.getRow<${tableName}RowType>(${config.tables[tableName]}, id, options);
        return new ${tableName}Row({tableId: ${config.tables[tableName]}, rowId: row.id, row, sdk: this.sdk, repository: this});
    }
    `,
      )
      .join("\n")}
}`;

  fs.writeFileSync(`${outDir}/Repository.ts`, factoryCode);

  // console.dir(tables);
}
