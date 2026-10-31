"use client"

import { ListLiveChannelsQuery } from "@/domain/channel";
import { useLiveChannels } from "@/features/browse/hooks/use-live-channels";

export function ChannelList({ query }: { query: ListLiveChannelsQuery }) {
  const { data, isPending, isError } = useLiveChannels(query);

  if(isPending) return <p>Loading...</p>
  if(isError) return <p>Could not load channels.</p>

  return (
    <ol>
      {data.map((channel) => (
        <li key={channel.id}>
          {channel.title} · {channel.streamerName} · {channel.viewerCount}
        </li>
      ))}
    </ol>
  )
}