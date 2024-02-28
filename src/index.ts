import c from "./client.js";

export type AddRowOptions = {
  user_field_names?: boolean;
  before?: number;
};

export type GetRowOptions = {
  user_field_names?: boolean;
};

export type ListRowsOptions = {
  page?: number;
  size?: number;
  user_field_names?: boolean;
  search?: string;
  order_by?: string;
  filters?: Record<string, unknown>;
  filter_type?: string;
  include?: string;
  exclude?: string;
  view_id?: number;
  [key: string]: unknown;
};

export type UpdateRowOptions = {
  user_field_names?: boolean;
};

export class BaserowSdk {
  constructor(databaseToken: string) {
    c.defaults.headers.common["Authorization"] = `Token ${databaseToken}`;
  }

  public async addRow<T extends Record<string, unknown>>(
    tableId: number,
    input: T,
    options: AddRowOptions = {},
  ): Promise<T> {
    const { data } = await c.post<T>(
      `/database/rows/table/${tableId}/`,
      input,
      { params: options },
    );
    return data;
  }

  public async getRow<T extends Record<string, unknown>>(
    tableId: number,
    rowId: number,
    options: GetRowOptions = {},
  ): Promise<T> {
    const { data } = await c.get<T>(
      `/database/rows/table/${tableId}/${rowId}/`,
      { params: options },
    );
    return data;
  }

  public async listRows<T extends Record<string, unknown>>(
    tableId: number,
    options: ListRowsOptions = {},
  ): Promise<T[]> {
    const { data } = await c.get<T[]>(`/database/rows/table/${tableId}/`, {
      params: options,
    });
    return data;
  }

  public async updateRow<T extends Record<string, unknown>>(
    tableId: number,
    rowId: number,
    input: T,
    options: UpdateRowOptions = {},
  ): Promise<T> {
    const { data } = await c.patch<T>(
      `/database/rows/table/${tableId}/${rowId}/`,
      input,
      { params: options },
    );
    return data;
  }
}
