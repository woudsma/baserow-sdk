import { FieldDefinition } from "../index.js";
import { mapPrimitive } from "./mapPrimitive.js";

export function makeFieldType(field: FieldDefinition): string {
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
