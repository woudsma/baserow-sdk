import { FieldDefinition } from "../../index.js";

export default function f(field: Partial<FieldDefinition>): FieldDefinition {
  return {
    id: 1,
    name: "the_field_name",
    type: "text",
    table_id: 1,
    order: 1,
    primary: false,
    read_only: false,
    ...field,
  };
}
