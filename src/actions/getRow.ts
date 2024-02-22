import { getDatabaseTableRow } from "../__generated__/baserow";
import { getConfig } from "../configStore";
import { limit } from "../limit";

export type GetRowOptions = {
  userFieldNames?: boolean;
};

export async function getRow<T>(
  rowId: number,
  tableId: number,
  options: GetRowOptions = {},
): Promise<T> {
  const { status, data } = await limit(() =>
    getDatabaseTableRow(rowId, tableId, options, getConfig()),
  );

  if (status !== 200) {
    console.dir(data, {
      depth: null,
    });
    throw new Error(`Failed to execute action: ${status}`);
  }

  return data as T;
}
