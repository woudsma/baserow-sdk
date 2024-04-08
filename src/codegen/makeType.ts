import { ListFieldsResponse, FieldDefinition } from "../index.js";

const DEFAULT_TYPE = "unknown";

function mapPrimitive(baserowPrimitive: string | undefined): string {
  switch (baserowPrimitive) {
    case "text":
      return "string";
    case "number":
      return "number | string";
    case "single_select":
      return "boolean";
    case "long_text":
      return "string";
    case "boolean":
      return "boolean";
    case "button":
      return "string";
    case "date":
      return "string";
    default:
      return DEFAULT_TYPE;
  }
}

function getFieldType(field: FieldDefinition): string {
  if (field.type === "link_row") {
    return '{ "id": number, "value": string }[]';
  }
  if (["rollup", "formula", "lookup"].includes(field.type)) {
    switch (field.formula_type) {
      case "array":
        return `(${mapPrimitive(field.array_formula_type)})[]`;
      default:
        return mapPrimitive(field.formula_type);
    }
  }
  return mapPrimitive(field.type);
}

export default function makeType(fields: ListFieldsResponse): string {
  let typeDef = `{\n`;

  fields.forEach((field) => {
    typeDef += `  "${field.name}": ${getFieldType(field)};\n`;
  });

  typeDef += `}`;

  return typeDef;
}
