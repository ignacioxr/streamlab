"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { ChannelCatalogProvider } from "@/features/browse";
import { httpChannelCatalog } from "@/infrastructure/client/http-channel-catalog";
import { getQueryClient } from "./get-query-client";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChannelCatalogProvider catalog={httpChannelCatalog}>
        {children}
      </ChannelCatalogProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
