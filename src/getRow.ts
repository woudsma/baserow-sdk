import { getDatabaseTableRow } from "./__generated__/baserow";

export type GetRowOptions = {
  userFieldNames?: boolean;
};

export async function getRow<T extends Record<string, unknown>>(
  rowId: number,
  tableId: number,
  options: GetRowOptions = {},
): Promise<T> {
  const result = await getDatabaseTableRow(rowId, tableId, options);

  if (result.status !== 200) {
    console.dir(result.data, {
      depth: null,
    });
    throw new Error(`Failed to get row: ${result.status}`);
  }

  return result.data as unknown as T;
}
