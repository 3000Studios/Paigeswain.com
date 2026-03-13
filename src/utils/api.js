export async function fetchJson(path, options = {}) {
  const { body, headers, ...rest } = options
  const requestHeaders = new Headers(headers ?? {})
  const init = {
    credentials: "include",
    ...rest,
    headers: requestHeaders,
  }

  if (body !== undefined) {
    if (body instanceof FormData) {
      init.body = body
    } else {
      requestHeaders.set("content-type", "application/json")
      init.body = typeof body === "string" ? body : JSON.stringify(body)
    }
  }

  const response = await fetch(path, init)
  const contentType = response.headers.get("content-type") ?? ""
  const payload = contentType.includes("application/json") ? await response.json() : null

  if (!response.ok) {
    throw new Error(payload?.error ?? "Request failed.")
  }

  return payload
}
