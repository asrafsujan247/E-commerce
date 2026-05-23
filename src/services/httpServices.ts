import axios, { type AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 50000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const setToken = (token: string | null | undefined): void => {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};

const responseBody = <T>(response: AxiosResponse<T>): T => response.data;

const requests = {
  get: <T>(url: string, config?: object): Promise<T> =>
    instance.get<T>(url, config).then(responseBody),
  post: <T>(url: string, body?: unknown, headers?: object): Promise<T> =>
    instance.post<T>(url, body, headers).then(responseBody),
  put: <T>(url: string, body?: unknown): Promise<T> =>
    instance.put<T>(url, body).then(responseBody),
};

export default requests;
