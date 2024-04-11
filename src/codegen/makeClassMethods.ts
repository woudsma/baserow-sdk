import { FieldDefinition, ListFieldsResponse } from "../index.js";
import { makeFieldType } from "./makeFieldType.js";
import { toCamelCase } from "./toCamelCase.js";

function makeGetter(
  field: FieldDefinition,
  tables: { id: number; name: string; fields: ListFieldsResponse }[],
): string {
  const t = makeFieldType(field);

  if (t.includes("number | string")) {
    return `public ${toCamelCase(`get ${field.name}`)}(): number {
        return parseFloat(this.getField<${t}>("${field.name}").toString());
    }`;
  }

  if (field.type === "link_row") {
    if (!field.link_row_table_id) {
      throw new Error("link_row_table_id is missing");
    }
    const foreignTable = tables.find((t) => field.link_row_table_id === t.id);
    if (!foreignTable) {
      throw new Error("foreign table not found");
    }
    return `public ${toCamelCase(`get ${field.name}`)}(): Promise<${toCamelCase(foreignTable.name, true)}Row[]> {
      return Promise.all(this.getField<{ "id": number, "value": string }[]>("${field.name}").map((r) => {
        return this.repository.${toCamelCase(`get one ${foreignTable.name}`)}(r.id);
      }));    
    }`;
  }

  if (field.type === "date" || field.formula_type === "date") {
    return `public ${toCamelCase(`get ${field.name}`)}(): Date {
        return new Date(this.getField<${t}>("${field.name}"));
    }`;
  }

  return `public ${toCamelCase(`get ${field.name}`)}(): ${t} {
        return this.getField<${t}>("${field.name}");
    }`;
}

function makeSetter(field: FieldDefinition): string {
  if (field.type === "link_row") {
    return `public ${toCamelCase(`set ${field.name}`)}(value: number[]): Promise<void> {
        return this.setField("${field.name}", value);
    }`;
  }

  return `public ${toCamelCase(`set ${field.name}`)}(value: ${makeFieldType(
    field,
  )}): Promise<void> {
        return this.setField("${field.name}", value);
    }`;
}

export default function makeClassMethods(
  tableId: number,
  tables: { id: number; name: string; fields: ListFieldsResponse }[],
): string {
  const methods: string[] = [];
  const table = tables.find((t) => t.id === tableId);

  table?.fields.forEach((field) => {
    methods.push(makeGetter(field, tables));
    if (!field.read_only) {
      methods.push(makeSetter(field));
    }
  });

  return methods.join("\n");
}
