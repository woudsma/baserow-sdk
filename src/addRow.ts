import { createDatabaseTableRow } from "./__generated__/baserow";

export type AddRowOptions = {
  clientSessionId?: string;
  clientUndoRedoActionGroupId?: string;
  before?: number;
  userFieldNames?: boolean;
};

export type AddRowReturnType = ReturnType<typeof createDatabaseTableRow>;

export async function addRow(
  tableId: number,
  input: Record<string, unknown>,
  options: AddRowOptions = {},
): AddRowReturnType {
  return createDatabaseTableRow(tableId, input, options);
}
