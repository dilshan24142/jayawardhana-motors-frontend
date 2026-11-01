import { afterEach, describe, expect, it, vi } from "vitest";
import { api, ApiError, setTokenGetter, setUnauthorizedHandler } from "./api";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

function mockFetch(response: Response) {
  const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  setTokenGetter(async () => null);
  setUnauthorizedHandler(() => {});
});

describe("api client", () => {
  it("returns parsed JSON and builds the query string", async () => {
    const fetchMock = mockFetch(json({ data: [], meta: { page: 2, pageSize: 20, total: 0 } }));
    const res = await api.get("/vehicles", { page: 2, q: "honda", status: undefined });
    expect(res).toEqual({ data: [], meta: { page: 2, pageSize: 20, total: 0 } });
    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:4000/api/v1/vehicles?page=2&q=honda");
  });

  it("attaches the auth token when one is available", async () => {
    const fetchMock = mockFetch(json({ data: {} }));
    setTokenGetter(async () => "token-123");
    await api.get("/me");
    const headers = fetchMock.mock.calls[0][1]!.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer token-123");
  });

  it("sends the idempotency key and JSON body on POST", async () => {
    const fetchMock = mockFetch(json({ data: { id: 1 } }, 201));
    await api.post("/sales", { salePrice: "250000.00" }, { idempotencyKey: "key-1" });
    const init = fetchMock.mock.calls[0][1]!;
    expect(init.method).toBe("POST");
    expect(init.body).toBe('{"salePrice":"250000.00"}');
    expect((init.headers as Record<string, string>)["Idempotency-Key"]).toBe("key-1");
  });

  it("throws ApiError with the backend code and message", async () => {
    mockFetch(json({ error: { code: "VEHICLE_ALREADY_SOLD", message: "Already sold" } }, 409));
    await expect(api.post("/sales", {})).rejects.toMatchObject({
      status: 409,
      code: "VEHICLE_ALREADY_SOLD",
      message: "Already sold",
    });
  });

  it("calls the unauthorized handler on 401", async () => {
    mockFetch(json({ error: { code: "UNAUTHORIZED", message: "Sign in to continue" } }, 401));
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    await expect(api.get("/me")).rejects.toBeInstanceOf(ApiError);
    expect(handler).toHaveBeenCalledOnce();
  });

  it("handles non-JSON error pages without crashing", async () => {
    mockFetch(new Response("<html>Bad Gateway</html>", { status: 502, statusText: "Bad Gateway" }));
    await expect(api.get("/vehicles")).rejects.toMatchObject({
      status: 502,
      code: "HTTP_502",
      message: "Bad Gateway",
    });
  });

  it("turns network failures into NETWORK_ERROR", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );
    await expect(api.get("/health")).rejects.toMatchObject({ status: 0, code: "NETWORK_ERROR" });
  });
});
