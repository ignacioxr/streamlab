"use client"

import type { ListLiveChannelsQuery } from "@/domain/channel";
import { useLiveChannels } from "@/features/browse/hooks/use-live-channels";
import { ChannelCard } from "./channel-card";

const ABOVE_THE_FOLD_COUNT = 4;

export function ChannelGrid({ query }: { query: ListLiveChannelsQuery }) {
  const { data, isPending, isError } = useLiveChannels(query);

  if (isPending) return <p>Loading...</p>
  if (isError) return <p>Could not load channels.</p>
  if (data.length === 0) return <p>No live channels right now.</p>

  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((channel, index) => (
        <li key={channel.id}>
          <ChannelCard channel={channel} eager={index < ABOVE_THE_FOLD_COUNT} />
        </li>
      ))}
    </ol>
  )
}