import { Table } from "../codegen.js";
import { FieldDefinition, ListFieldsResponse } from "../index.js";
import { getRawType } from "./getRawType.js";
import { toCamelCase } from "./toCamelCase.js";

function getForeignTable(
  field: FieldDefinition,
  tables: Table[],
): { id: number; name: string } {
  if (!field.link_row_table_id) {
    throw new Error("link_row_table_id is missing");
  }
  const foreignTable = tables.find((t) => field.link_row_table_id === t.id);
  if (!foreignTable) {
    throw new Error("foreign table not found");
  }
  return foreignTable;
}

function getReturnType(field: FieldDefinition, tables: Table[]): string {
  if (field.type === "date" || field.formula_type === "date") {
    return "Date";
  }

  if (field.type === "link_row") {
    const foreignTable = getForeignTable(field, tables);
    return `Promise<${toCamelCase(foreignTable.name, true)}Row[]>`;
  }

  if (field.type === "single_select") {
    if (!field.select_options) {
      throw new Error(
        `Field ${field.name} is a single_select but has no select_options`,
      );
    }
    return field.select_options
      ?.map((option) => `"${option.value}"`)
      .join(" | ");
  }

  if (field.type === "number" || field.formula_type === "number") {
    return "number";
  }

  return getRawType(field);
}

function getBody(field: FieldDefinition, tables: Table[]): string {
  const rawType = getRawType(field);
  const query = `this.getField<${rawType}>("${field.name}")`;

  if (field.type === "number" || field.formula_type === "number") {
    return `return parseFloat(${query}.toString());`;
  }

  if (field.type === "single_select") {
    return `return ${query}.value;`;
  }

  if (field.type === "link_row") {
    const foreignTable = getForeignTable(field, tables);
    return `return Promise.all(${query}.map((r) => this.repository.${toCamelCase(`get one ${foreignTable.name}`)}(r.id)));`;
  }

  if (field.type === "date" || field.formula_type === "date") {
    return `return new Date(${query});`;
  }

  return `return ${query};`;
}

export function makeGetter(
  field: FieldDefinition,
  tables: { id: number; name: string; fields: ListFieldsResponse }[],
): string {
  const fn = toCamelCase(`get ${field.name}`);
  const rt = getReturnType(field, tables);
  const bd = getBody(field, tables);

  return `\n  public ${fn}(): ${rt} {\n    ${bd}\n  }`;
}
