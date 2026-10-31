import { ChannelCatalog, ChannelSchema } from "@/domain/channel";
import z from "zod";

const ChannelListSchema = z.array(ChannelSchema);

export const httpChannelCatalog: ChannelCatalog = {
  async listLive({ category, limit }) {
    const params = new URLSearchParams({ limit: String(limit) });

    if(category) params.set("category", category);

    const response = await fetch(`/api/channels?${params}`);
    if(!response.ok) {
      throw new Error(`Failed to load channels: ${response.status}`);
    }

    return ChannelListSchema.parse(await response.json());
  }
}