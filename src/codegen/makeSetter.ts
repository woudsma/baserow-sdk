import { FieldDefinition } from "../index.js";
import { makeFieldType } from "./makeFieldType.js";
import { toCamelCase } from "./toCamelCase.js";

export function makeSetter(field: FieldDefinition): string {
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
