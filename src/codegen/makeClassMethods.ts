import { FieldDefinition, ListFieldsResponse } from "../index.js";
import { makeFieldType } from "./makeFieldType.js";
import * as emoji from "node-emoji";

function toCamelCase(str: string): string {
  return emoji
    .unemojify(str)
    .replaceAll(":", "")
    .replace(/([-_\s:][a-z])/gi, ($1) => {
      return $1
        .toUpperCase()
        .replace("-", "")
        .replace("_", "")
        .replace(" ", "");
    });
}

function makeGetter(field: FieldDefinition): string {
  const t = makeFieldType(field);

  if (t.includes("number | string")) {
    return `public ${toCamelCase(`get ${field.name}`)}(): number {
        return parseFloat(this.getField<${t}>("${field.name}").toString());
    }`;
  }

  return `public ${toCamelCase(`get ${field.name}`)}(): ${t} {
        return this.getField<${t}>("${field.name}");
    }`;
}

export default function makeClassMethods(fields: ListFieldsResponse): string {
  let classMethods = "";

  fields.forEach((field) => {
    const t = makeFieldType(field);
    classMethods += `
    ${makeGetter(field)}

    public ${toCamelCase(`set ${field.name}`)}(value: ${t}): Promise<void> {
        return this.setField("${field.name}", value);
    }
    `;
  });

  return classMethods;
}
