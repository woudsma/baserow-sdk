import { InternalAxiosRequestConfig } from "axios";

const DEFAULT_PARAMS = {
  user_field_names: true,
};

export const MAX_REQUESTS_COUNT = 1;
export const INTERVAL_MS = 10;

export class Interceptors {
  private pending = 0;

  public onRequest(
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> {
    config.params = {
      ...DEFAULT_PARAMS,
      ...(config.params as Record<string, unknown>),
    };

    const params = config.params as { filters?: unknown };

    if (params.filters !== undefined) {
      params.filters = JSON.stringify(params.filters);
    }

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.pending < MAX_REQUESTS_COUNT) {
          this.pending++;
          clearInterval(interval);
          resolve(config);
        }
      }, INTERVAL_MS);
    });
  }

  public onResponse<T>(response: T): Promise<T> {
    this.pending = Math.max(0, this.pending - 1);
    return Promise.resolve(response);
  }

  public onError<T>(error: T): Promise<T> {
    this.pending = Math.max(0, this.pending - 1);
    return Promise.reject(error);
  }
}
