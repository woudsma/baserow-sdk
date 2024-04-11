import { ListFieldsResponse } from "../index.js";
import { makeGetter } from "./makeGetter.js";
import { makeSetter } from "./makeSetter.js";

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
