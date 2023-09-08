export function get<Response>(url: string) {
  return wrappedFetch<undefined, Response>(url, "GET");
}

export function post<Body, Response>(url: string, body: Body) {
  return wrappedFetch<Body, Response>(url, "POST", body);
}

export function patch<Body, Response>(url: string, body: Body) {
  return wrappedFetch<Body, Response>(url, "PATCH", body);
}

export function del<Response = any>(url: string) {
  return wrappedFetch<undefined, Response>(url, "DELETE");
}

async function wrappedFetch<Body, Response = any>(url: string, method: string, body?: Body) {
  const res = fetch(url, {
    method,
    body: body ? JSON.stringify(body) : undefined
  });
  return (await res).json() as Response
}
