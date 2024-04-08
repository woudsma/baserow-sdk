import { ListFieldsResponse } from "../index.js";
import { makeFieldType } from "./makeFieldType.js";

export default function makeType(fields: ListFieldsResponse): string {
  let typeDef = `{\n`;

  typeDef += '  "id": number;\n';
  typeDef += '  "order": string;\n';

  fields.forEach((field) => {
    typeDef += `  "${field.name}": ${makeFieldType(field)};\n`;
  });

  typeDef += `}`;

  return typeDef;
}
