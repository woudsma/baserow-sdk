import { FieldDefinition } from "../index.js";
import { mapPrimitive } from "./mapPrimitive.js";

export function getRawType(field: FieldDefinition): string {
  if (field.type === "link_row") {
    return 'string[] | { "id": number, "value": string }[]';
  }

  if (["rollup", "formula", "lookup"].includes(field.type)) {
    switch (field.formula_type) {
      case "array":
        return `FieldValue<${mapPrimitive(field.array_formula_type)}>[]`;
      default:
        return mapPrimitive(field.formula_type);
    }
  }

  if (field.type === "single_select") {
    if (!field.select_options) {
      throw new Error(
        `Field ${field.name} is a single_select but has no select_options`,
      );
    }

    const options = field.select_options
      .map((option) => {
        return `{ id: ${option.id}, value: "${option.value}", color: "${option.color}" }`;
      })
      .join(" | ");

    return `(${options})`;
  }

  return mapPrimitive(field.type);
}
