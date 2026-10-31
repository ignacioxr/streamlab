"use client"

import { ListLiveChannelsQuery } from "@/domain/channel";
import { useLiveChannels } from "@/features/browse/hooks/use-live-channels";
import { ChannelCard } from "./channel-card";

export function ChannelList({ query }: { query: ListLiveChannelsQuery }) {
  const { data, isPending, isError } = useLiveChannels(query);

  if(isPending) return <p>Loading...</p>
  if(isError) return <p>Could not load channels.</p>

  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((channel) => (
        <li key={channel.id}>
          <ChannelCard channel={channel} />
        </li>
      ))}
    </ol>
  )
}