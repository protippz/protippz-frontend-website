export const base = "https://qg114d4c-5000.asse.devtunnels.ms";
// export const base = "http://192.168.0.108:5000";

export const baseUrl = (url: string) => {
  if (url?.startsWith("/")) return `${base}${url}`;
  if (url?.startsWith("http")) return url;
  return `${base}/${url}`;
};

export const imageUrl = (url: string) => {
  if (!url) return "";
  if (url.includes("http")) return url;
  if (url.startsWith("/")) return `${base}${url}`;
  return `${base}/${url}`;
};

const defaultServer = "https://qg114d4c-5000.asse.devtunnels.ms";
// const defaultServer = "http://18.218.23.153:5000";

const request = async (
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  options: {
    body?: Record<string, any> | FormData;
    headers?: Record<string, string>;
    server?: string;
  } = {},
) => {
  const { body, headers = {}, server = defaultServer } = options;

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${server}${url}`, {
    method,
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
    cache: "no-store",
  });

  return response.json();
};

// Reusable HTTP methods
export const get = (url: string, options = {}) => request("GET", url, options);

export const post = (url: string, body: any, options = {}) =>
  request("POST", url, { ...options, body });

export const patch = (url: string, body: any, options = {}) =>
  request("PATCH", url, { ...options, body });

export const remove = (url: string, options = {}) =>
  request("DELETE", url, options);
