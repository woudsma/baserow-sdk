import { getDatabaseTableRow } from "./__generated__/baserow";

export type GetRowOptions = {
  userFieldNames?: boolean;
};

export type GetRowReturnType = ReturnType<typeof getDatabaseTableRow>;

export function getRow(
  rowId: number,
  tableId: number,
  options: GetRowOptions = {},
): GetRowReturnType {
  return getDatabaseTableRow(rowId, tableId, options);
}
