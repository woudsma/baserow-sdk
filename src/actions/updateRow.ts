import { RequestOpts } from "@oazapfts/runtime";
import { updateDatabaseTableRow } from "../__generated__/baserow";

export type UpdateRowOptions = {
  clientSessionId?: string;
  clientUndoRedoActionGroupId?: string;
  userFieldNames?: boolean;
};

export async function updateRow<T>(
  config: RequestOpts,
  tableId: number,
  rowId: number,
  input: Record<string, unknown>,
  options: UpdateRowOptions = {},
): Promise<T> {
  const { status, data } = await updateDatabaseTableRow(
    tableId,
    rowId,
    input,
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
