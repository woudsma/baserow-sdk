import { FieldDefinition } from "../index.js";
import { makeFieldType } from "./makeFieldType.js";
import { toCamelCase } from "./toCamelCase.js";

function getInputType(field: FieldDefinition): string {
  if (field.type === "link_row") {
    return "number[]";
  }

  return makeFieldType(field);
}

export function makeSetter(field: FieldDefinition): string {
  const fn = toCamelCase(`set ${field.name}`);
  const it = getInputType(field);
  const bd = `return this.setField("${field.name}", value);`;

  return `\n  public ${fn}(value: ${it}): Promise<void> {\n    ${bd}\n  }`;
}
