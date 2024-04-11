import { BaserowSdk, ListFieldsResponse } from "./index.js";
import fs from "fs";
import makeType from "./codegen/makeType.js";
import makeModelMethods from "./codegen/makeModelMethods.js";
import path from "path";
import { getConfig } from "./getConfig.js";
import makeRepositoryMethods from "./codegen/makeRepositoryMethods.js";

export type Table = { id: number; name: string; fields: ListFieldsResponse };

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default async function main(): Promise<void> {
  const config = getConfig();

  console.dir(config);

  const outDir = path.join(path.dirname(config.config), config.outDir);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const sdk = new BaserowSdk(String(config.databaseToken));

  const tables: Table[] = await Promise.all(
    Object.entries(config.tables).map(async ([name, id]) => {
      return {
        name,
        id,
        fields: await sdk.listFields(id),
      };
    }),
  );

  tables.map((table) => {
    console.dir(table, { depth: null });
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

import { Row } from "${__dirname}/row.js";
import { Repository } from "./Repository.js";
import { BaserowSdk } from "${__dirname}/index.js";
${foreignTables
  .map((t) => {
    return `import { ${t?.name}Row } from "./${t?.name}.js";`;
  })
  .join("\n")}

export class ${tableName}Row extends Row<${tableName}RowType> {
  protected repository: Repository;
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
${makeModelMethods(table.id, tables)}
}`;

    fs.writeFileSync(`${outDir}/${tableName}.ts`, typeDef);
  });

  const factoryCode = `import { Factory } from '${__dirname}/factory.js'
import { ListRowsOptions, GetRowOptions } from '${__dirname}/index.js'
${Object.keys(config.tables)
  .map(
    (tableName) =>
      `import { ${tableName}Row, ${tableName}RowType } from './${tableName}.js';`,
  )
  .join("\n")}

export class Repository extends Factory {
${makeRepositoryMethods(tables)}
}`;

  fs.writeFileSync(`${outDir}/Repository.ts`, factoryCode);

  // console.dir(tables);
}
