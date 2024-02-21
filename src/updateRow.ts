import { updateDatabaseTableRow } from "./__generated__/baserow";

export type UpdateRowOptions = {
  clientSessionId?: string;
  clientUndoRedoActionGroupId?: string;
  userFieldNames?: boolean;
};

export async function updateRow<T extends Record<string, unknown>>(
  tableId: number,
  rowId: number,
  input: Record<string, unknown>,
  options: UpdateRowOptions = {},
): Promise<T> {
  const result = await updateDatabaseTableRow(tableId, rowId, input, options);

  if (result.status !== 200) {
    console.dir(result.data, {
      depth: null,
    });
    throw new Error(`Failed to add row: ${result.status}`);
  }

  return result.data as unknown as T;
}
