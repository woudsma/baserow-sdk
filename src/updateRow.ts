import { RequestOpts } from "@oazapfts/runtime";
import { updateDatabaseTableRow } from "./__generated__/baserow";
import { makeAction } from "./makeAction";

export type UpdateRowOptions = {
  clientSessionId?: string;
  clientUndoRedoActionGroupId?: string;
  userFieldNames?: boolean;
};

export const updateRow = makeAction({
  fn: (
    config: RequestOpts,
    tableId: number,
    rowId: number,
    input: Record<string, unknown>,
    options: UpdateRowOptions = {},
  ) => updateDatabaseTableRow(tableId, rowId, input, options, config),
});
