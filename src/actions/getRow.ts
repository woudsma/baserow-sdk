import { RequestOpts } from "@oazapfts/runtime";
import { getDatabaseTableRow } from "../__generated__/baserow";

export type GetRowOptions = {
  userFieldNames?: boolean;
};

export async function getRow<T>(
  config: RequestOpts,
  rowId: number,
  tableId: number,
  options: GetRowOptions = {},
): Promise<T> {
  const { status, data } = await getDatabaseTableRow(
    rowId,
    tableId,
    options,
    config,
  );

  if (status !== 200) {
    console.dir(data, {
      depth: null,
    });
    throw new Error(`Failed to execute action: ${status}`);
  }

  return data as T;
}
