import { describe, expect, it } from "vitest";
import { rankChannels } from "./rank-channels";
import { buildChannel } from "@/test/build-channel";

describe("rankChannels", () => {
  it("orders channels by viewer count, highest first", () => {
    const channels = [
      buildChannel({ id: "a", viewerCount: 10 }),
      buildChannel({ id: "b", viewerCount: 500 }),
      buildChannel({ id: "c", viewerCount: 42 }),
    ];

    expect(rankChannels(channels).map((c) => c.id)).toEqual(["b", "c", "a"]);
  });

  it("breaks ties by title so the order is deterministic", () => {
    const channels = [
      buildChannel({ id: "b", title: "Zelda run", viewerCount: 500 }),
      buildChannel({ id: "a", title: "Art stream", viewerCount: 500 })
    ];

    expect(rankChannels(channels).map((c) => c.id)).toEqual(["a", "b"]);
  });

  it("does not mutate the input", () => {
    const channels = [
      buildChannel({ id: "a", viewerCount: 1 }),
      buildChannel({ id: "b", viewerCount: 2 })
    ];

    const ranked = rankChannels(channels);

    expect(ranked.map((c) => c.id)).toEqual(["b", "a"]);
    expect(channels.map((c) => c.id)).toEqual(["a", "b"]);
  });

  it("returns an empty list for no channels", () => {
    expect(rankChannels([])).toEqual([]);
  });
});
