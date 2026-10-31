import { describe, expect, it, vi } from "vitest";
import { seedChannelCatalog } from "./seed-channel-catalog";

vi.mock("server-only", () => ({}));

describe("seedChannelCatalog.listLive", () => {
  it("returns only live channels", async () => {
    const channels = await seedChannelCatalog.listLive({ limit: 100 });

    expect(channels.length).toBeGreaterThan(0);
    expect(channels.every((c) => c.isLive)).toBe(true);
  });

  it("respects the limit", async () => {
    const channels = await seedChannelCatalog.listLive({ limit: 5 });

    expect(channels).toHaveLength(5);
  });

  it("filters by category", async () => {
    const channels = await seedChannelCatalog.listLive({
      category: "music",
      limit: 100
    });

    expect(channels.length).toBeGreaterThan(0);
    expect(channels.every((c) => c.category === "music")).toBe(true);
  });

  it("returns channels ranked by viewer count", async () => {
    const channels = await seedChannelCatalog.listLive({ limit: 100 });
    const counts = channels.map((c) => c.viewerCount);

    expect(counts).toEqual(counts.toSorted((a, b) => b - a));
  });
});