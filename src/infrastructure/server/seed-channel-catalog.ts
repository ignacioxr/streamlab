import "server-only";

import { ChannelCatalog, ChannelSchema, rankChannels } from "@/domain/channel";
import rawChannels from "./seed/channels.json";
import z from "zod";

const channels = z.array(ChannelSchema).parse(rawChannels);

export const seedChannelCatalog: ChannelCatalog = {
  async listLive({ category, limit }) {
    const live = channels.filter(
      (channel) =>
        channel.isLive && (category === undefined || channel.category === category)
    );

    return rankChannels(live).slice(0, limit);
  }
};