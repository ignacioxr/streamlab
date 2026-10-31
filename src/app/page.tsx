import { Suspense } from "react";
import { connection } from "next/server";
import { dehydrate, HydrationBoundary, noop } from "@tanstack/react-query";
import { getQueryClient } from "./_providers/get-query-client";
import {
  CategoryFilter,
  ChannelGrid,
  ChannelGridSkeleton,
  liveChannelsQueryOptions,
  parseCategoryParam,
} from "@/features/browse";
import { seedChannelCatalog } from "@/infrastructure/server/seed-channel-catalog";
import type { ListLiveChannelsQuery } from "@/domain/channel";

const BROWSE_LIMIT = 24;

type SearchParams = PageProps<"/">["searchParams"];

export default function BrowsePage({ searchParams }: PageProps<"/">) {
  return (
    <main className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6">
      <h1 className="mb-4 text-xl font-semibold">Live channels</h1>
      <Suspense fallback={<CategoryFilter />}>
        <ActiveCategoryFilter searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<ChannelGridSkeleton count={BROWSE_LIMIT} />}>
        <LiveChannels searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function ActiveCategoryFilter({ searchParams }: { searchParams: SearchParams }) {
  const { category } = await searchParams;
  return <CategoryFilter active={parseCategoryParam(category) ?? "all"} />;
}

async function LiveChannels({ searchParams }: { searchParams: SearchParams }) {
  await connection();
  const { category } = await searchParams;

  const query: ListLiveChannelsQuery = {
    limit: BROWSE_LIMIT,
    category: parseCategoryParam(category),
  };

  const queryClient = getQueryClient();
  await queryClient
    .query(liveChannelsQueryOptions(seedChannelCatalog, query))
    .catch(noop);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChannelGrid query={query} />
    </HydrationBoundary>
  );
}