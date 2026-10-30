import { describe, expect, it } from "vitest";
import type { Channel } from "./channel.schema";
import { rankChannels } from "./rank-channels";

function makeChannel(overrides: Partial<Channel> = {}): Channel {
  return {
    id: "1",
    slug: "test-channel",
    title: "Test channel",
    streamerName: "tester",
    category: "gaming",
    thumbnailUrl: "https://example.com/thumb.jpg",
    viewerCount: 0,
    isLive: true,
    ...overrides,
  };
}

describe("rankChannels", () => {
  it("orders channels by viewer count, highest first", () => {
    const channels = [
      makeChannel({ id: "a", viewerCount: 10 }),
      makeChannel({ id: "b", viewerCount: 500 }),
      makeChannel({ id: "c", viewerCount: 42 }),
    ];

    expect(rankChannels(channels).map((c) => c.id)).toEqual(["b", "c", "a"]);
  });

  it("breaks ties by title so the order is deterministic", () => {
    const channels = [
      makeChannel({ id: "b", title: "Zelda run", viewerCount: 500 }),
      makeChannel({ id: "a", title: "Art stream", viewerCount: 500 })
    ];

    expect(rankChannels(channels).map((c) => c.id)).toEqual(["a", "b"]);
  });

  it("does not mutate the input", () => {
    const channels = [
      makeChannel({ id: "a", viewerCount: 1 }),
      makeChannel({ id: "b", viewerCount: 2 })
    ];

    const ranked = rankChannels(channels);

    expect(ranked.map((c) => c.id)).toEqual(["b", "a"]);
    expect(channels.map((c) => c.id)).toEqual(["a", "b"]);
  });

  it("returns an empty list for no channels", () => {
    expect(rankChannels([])).toEqual([]);
  });
});
