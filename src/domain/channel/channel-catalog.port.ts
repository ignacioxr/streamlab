import { Category, Channel } from "./channel.schema"

export type ListLiveChannelsQuery = {
  category?: Category;
  limit: number;
};

export interface ChannelCatalog {
  listLive(query: ListLiveChannelsQuery): Promise<Channel[]>;
};