import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";

vi.mock("server-only", () => ({}));

function get(query = "") {
  return GET(new Request(`http://localhost/api/channels${query}`));
}

describe("route", () => {
   it("valid params with filtered results", async () => {
    const response = await get("?category=music&limit=5");

    expect(response.status).toBe(200);
   });
   
   it("defaults to 24 channels when no params are given", async () => {
    const response = await get();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(24)
   });

   it.each([
    ["limit=0"],
    ["limit=abc"],
    ["limit=101"],
    ["limit=1.5"],
    ["category=cooking"]
   ])("returns 400 for ?%s", async (query) => {
      const response = await get(`?${query}`);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe("Invalid query");
   });

   it("returns 400 when a query param is repeated", async () => {
    const response = await get("?category=music&category=gaming");
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invalid query");
   });
})