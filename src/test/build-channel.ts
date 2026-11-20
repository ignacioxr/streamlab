import { Channel } from "@/domain/channel";

export function buildChannel(overrides: Partial<Channel> = {}): Channel {
  return {
    id: "ch-1",
    slug: "test-channel",
    title: "Test channel",
    streamerName: "tester",
    category: "gaming",
    thumbnailUrl: "https://picsum.photos/seed/test/640/360",
    viewerCount: 1000,
    isLive: true,
    ...overrides,
  };
}