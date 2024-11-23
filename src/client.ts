import axios from "axios";
import { Interceptors } from "./interceptors.js";

const client = axios.create();

client.defaults.baseURL = "https://baserow.spot-on.tools/api/";
client.defaults.headers.common["Content-Type"] = "application/json";

const interceptors = new Interceptors();

client.interceptors.request.use((c) => interceptors.onRequest(c));
client.interceptors.response.use(
  (r) => interceptors.onResponse(r),
  (e) => interceptors.onError(e),
);

export default client;
