import { Table } from "../codegen.js";
import { FieldDefinition, ListFieldsResponse } from "../index.js";
import { getRawType } from "./getRawType.js";
import { toCamelCase } from "./toCamelCase.js";

function getForeignTable(field: FieldDefinition, tables: Table[]): Table {
  if (!field.link_row_table_id) {
    throw new Error("link_row_table_id is missing");
  }
  const foreignTable = tables.find((t) => field.link_row_table_id === t.id);
  if (!foreignTable) {
    console.warn("tables", tables);
    console.warn("field", field);
    throw new Error("foreign table not found");
  }
  return foreignTable;
}

function getReturnType(field: FieldDefinition, tables: Table[]): string {
  if (field.type === "date" || field.formula_type === "date") {
    return "Date";
  }

  function lowerCaseFirstLetter(str: string) {
    return str[0].toLowerCase() + str.slice(1);
  }

  if (field.type === "link_row") {
    const foreignTable = getForeignTable(field, tables);
    const tableName = toCamelCase(foreignTable.name, true);
    return `Promise<${lowerCaseFirstLetter(tableName)}Row[]>`;
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
    return `return parseFloat(String(${query}));`;
  }

  if (field.type === "single_select") {
    return `return ${query}.value;`;
  }

  if (field.type === "link_row") {
    const foreignTable = getForeignTable(field, tables);
    const tableId = field.link_row_table_id;
    const fieldId = field.link_row_related_field_id;
    const foreignField = foreignTable.fields.find((f) => f.id === fieldId);
    const fieldName = foreignField?.name;
    const className = `${foreignTable.name}Row`;
    return `return this.getLinkedRows(${tableId}, "${fieldName}", ${className});`;
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
