import { getDatabaseTableRow } from "./__generated__/baserow";
import { makeAction } from "./makeAction";

export type GetRowOptions = {
  userFieldNames?: boolean;
};

export const getRow = makeAction({
  fn: (rowId: number, tableId: number, options: GetRowOptions = {}) =>
    getDatabaseTableRow(rowId, tableId, options),
});
