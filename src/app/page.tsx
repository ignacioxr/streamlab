import { Suspense } from "react";
import { connection } from "next/server";
import { dehydrate, HydrationBoundary, noop } from "@tanstack/react-query";
import { getQueryClient } from "./_providers/get-query-client";
import {
  ChannelGrid,
  ChannelGridSkeleton,
  liveChannelsQueryOptions,
} from "@/features/browse";
import { seedChannelCatalog } from "@/infrastructure/server/seed-channel-catalog";
import type { ListLiveChannelsQuery } from "@/domain/channel";

const BROWSE_QUERY: ListLiveChannelsQuery = { limit: 24 };

export default function BrowsePage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6">
      <h1>Live channels</h1>
      <Suspense fallback={<ChannelGridSkeleton count={BROWSE_QUERY.limit}/>}>
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
      <ChannelGrid query={BROWSE_QUERY} />
    </HydrationBoundary>
  );
}
