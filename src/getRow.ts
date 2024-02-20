import { getDatabaseTableRow } from "./__generated__/baserow";

export type GetRowOptions = {
  userFieldNames?: boolean;
};

export function getRow(
  rowId: number,
  tableId: number,
  options: GetRowOptions = {},
) {
  return getDatabaseTableRow(rowId, tableId, options);
}
