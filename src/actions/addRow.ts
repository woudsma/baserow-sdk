import { RequestOpts } from "@oazapfts/runtime";
import { createDatabaseTableRow } from "../__generated__/baserow";
import { makeAction } from "../makeAction";

export type AddRowOptions = {
  clientSessionId?: string;
  clientUndoRedoActionGroupId?: string;
  before?: number;
  userFieldNames?: boolean;
};

export const addRow = makeAction({
  fn: (
    config: RequestOpts,
    tableId: number,
    input: Record<string, unknown>,
    options: AddRowOptions = {},
  ) => createDatabaseTableRow(tableId, input, options, config),
});
