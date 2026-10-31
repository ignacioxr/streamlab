import { queryOptions } from "@tanstack/react-query";
import type { ChannelCatalog, ListLiveChannelsQuery } from "@/domain/channel";

export const browseKeys = {
  all: ["browse"] as const,
  live: (query: ListLiveChannelsQuery) =>
    [...browseKeys.all, "live", query] as const,
};

export function liveChannelsQueryOptions(
  catalog: ChannelCatalog,
  query: ListLiveChannelsQuery
) {
  return queryOptions({
    queryKey: browseKeys.live(query),
    queryFn: () => catalog.listLive(query)
  });
};
