import { ListLiveChannelsQuery } from "@/domain/channel";
import { useChannelCatalog } from "@/features/browse/channel-catalog-context";
import { useQuery } from "@tanstack/react-query";
import { liveChannelsQueryOptions } from "@/features/browse/queries";

export function useLiveChannels(query: ListLiveChannelsQuery) {
  const catalog = useChannelCatalog();
  return useQuery(liveChannelsQueryOptions(catalog, query));
}