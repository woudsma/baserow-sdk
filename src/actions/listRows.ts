import { RequestOpts } from "@oazapfts/runtime";
import { listDatabaseTableRows } from "../__generated__/baserow";
import { makeAction } from "../makeAction";

export type ListRowsOptions = {
  exclude?: string;
  filterFieldFilter?: string;
  filterType?: string;
  filters?: Record<string, unknown>;
  include?: string;
  orderBy?: string;
  page?: number;
  search?: string;
  searchMode?: string;
  size?: number;
  userFieldNames?: boolean;
  viewId?: number;
  [key: string]: unknown;
};

export const listRows = makeAction({
  fn: (config: RequestOpts, tableId: number, options: ListRowsOptions = {}) =>
    listDatabaseTableRows(
      tableId,
      {
        userFieldNames: true,
        ...options,
        filters: JSON.stringify(options.filters),
      },
      config,
    ),
});
