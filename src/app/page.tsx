import { dehydrate, HydrationBoundary, noop } from "@tanstack/react-query";
import { getQueryClient } from "./_providers/get-query-client";
import { ChannelList, liveChannelsQueryOptions } from "@/features/browse";
import { seedChannelCatalog } from "@/infrastructure/server/seed-channel-catalog";
import { ListLiveChannelsQuery } from "@/domain/channel";
import { connection } from "next/server";
import { Suspense } from "react";

const BROWSE_QUERY: ListLiveChannelsQuery = { limit: 24 };

export default function BrowsePage() {
  return (
    <main>
      <h1>Live channels</h1>
      <Suspense fallback={<p>Loading channels...</p>}>
        <LiveChannels />
      </Suspense>
    </main>
  );
}

async function LiveChannels() {
  await connection();

  const queryClient = getQueryClient();
  await queryClient
    .query(liveChannelsQueryOptions(seedChannelCatalog, BROWSE_QUERY))
    .catch(noop);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChannelList query={BROWSE_QUERY} />
    </HydrationBoundary>
  );
}
