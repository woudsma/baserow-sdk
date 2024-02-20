import { listDatabaseTableRows } from "./__generated__/baserow";

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
) {
  const result = await listDatabaseTableRows(tableId, {
    userFieldNames: true,
    ...options,
    filters: JSON.stringify(options.filters),
  });

  if (result.status !== 200) {
    console.dir(result.data, {
      depth: null,
    });
    throw new Error(`Failed to list rows: ${result.status}`);
  }

  return result.data.results as T[];
}
