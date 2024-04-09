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

function makeSetter(field: FieldDefinition): string {
  return `public ${toCamelCase(`set ${field.name}`)}(value: ${makeFieldType(
    field,
  )}): Promise<void> {
        return this.setField("${field.name}", value);
    }`;
}

export default function makeClassMethods(fields: ListFieldsResponse): string {
  const methods: string[] = [];

  fields.forEach((field) => {
    methods.push(makeGetter(field));
    if (!field.read_only) {
      methods.push(makeSetter(field));
    }
  });

  return methods.join("\n");
}
