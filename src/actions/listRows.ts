import { listDatabaseTableRows } from "../__generated__/baserow";
import { getConfig } from "../configStore";
import { limit } from "../limit";

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

export async function listRows<T>(
  tableId: number,
  options: ListRowsOptions = {},
): Promise<T[]> {
  const { status, data } = await limit(() =>
    listDatabaseTableRows(
      tableId,
      {
        userFieldNames: true,
        ...options,
        filters: JSON.stringify(options.filters),
      },
      getConfig(),
    ),
  );

  if (status !== 200) {
    console.dir(data, {
      depth: null,
    });
    throw new Error(`Failed to execute action: ${status}`);
  }

  return data.results as T[];
}
