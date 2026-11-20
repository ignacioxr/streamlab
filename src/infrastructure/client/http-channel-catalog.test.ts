import { afterEach, describe, expect, it, vi } from "vitest";
import { httpChannelCatalog } from "./http-channel-catalog";
import { buildChannel } from "@/test/build-channel";
import { ZodError } from "zod";

function mockFetch(response: Response) {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
}); 

describe("httpChannelCatalog.listLive", () => {
  it("requests the channels endpoint with limit and category", async () => {
    const fetchMock = mockFetch(Response.json([]));

    await httpChannelCatalog.listLive({ category: "music", limit: 12 });

    expect(fetchMock).toHaveBeenCalledWith("/api/channels?limit=12&category=music");
  });

  it("omits category when it is not provided", async () => {
    const fetchMock = mockFetch(Response.json([]));

    await httpChannelCatalog.listLive({ limit: 12 });

    expect(fetchMock).toHaveBeenCalledWith("/api/channels?limit=12");
  });

  it("returns the parsed channels on success", async () => {
    const channels = [buildChannel()];
    mockFetch(Response.json(channels));

    const result = await httpChannelCatalog.listLive({ limit: 24 });

    expect(result).toEqual(channels);
  });

  it("throws with the status when the response is not ok", async () => {
    mockFetch(new Response(null, { status: 500 })); 

    await expect(httpChannelCatalog.listLive({ limit: 24 })).rejects.toThrow("500");
  });

  it("rejects a payload that does not match the schema", async () => {
    mockFetch(Response.json([{ id: 1 }]));

    await expect(httpChannelCatalog.listLive({ limit: 24 })).rejects.toThrow(ZodError);
  });
});