import { Channel } from "./channel.schema";

export function rankChannels(channels: readonly Channel[]): Channel[] {
  return channels.toSorted(
    (a, b) =>
      b.viewerCount - a.viewerCount || a.title.localeCompare(b.title)
  );
};