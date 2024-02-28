import axios, { InternalAxiosRequestConfig } from "axios";

const DEFAULT_PARAMS = {
  user_field_names: true,
};

const MAX_REQUESTS_COUNT = 1;
const INTERVAL_MS = 10;

const client = axios.create();

client.defaults.baseURL = "https://baserow.taskratchet.com/api/";
client.defaults.headers.common["Content-Type"] = "application/json";

let pendingRequests = 0;

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.params = {
    ...DEFAULT_PARAMS,
    ...(config.params as Record<string, unknown>),
  };

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (pendingRequests < MAX_REQUESTS_COUNT) {
        pendingRequests++;
        clearInterval(interval);
        resolve(config);
      }
    }, INTERVAL_MS);
  });
});

export default client;
