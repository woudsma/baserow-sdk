import { createDatabaseTableRow } from "./__generated__/baserow";

export type AddRowOptions = {
  clientSessionId?: string;
  clientUndoRedoActionGroupId?: string;
  before?: number;
  userFieldNames?: boolean;
};

export async function addRow<T extends Record<string, unknown>>(
  tableId: number,
  input: Record<string, unknown>,
  options: AddRowOptions = {},
): Promise<T> {
  const result = await createDatabaseTableRow(tableId, input, options);

  if (result.status !== 200) {
    console.dir(result.data, {
      depth: null,
    });
    throw new Error(`Failed to add row: ${result.status}`);
  }

  return result.data as unknown as T;
}
