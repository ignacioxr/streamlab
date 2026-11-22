import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import type { ChannelCatalog } from "@/domain/channel";
import { ChannelCatalogProvider } from "@/features/browse";

export function renderWithProviders(
  ui: ReactElement,
  { catalog }: { catalog: ChannelCatalog }
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ChannelCatalogProvider catalog={catalog}>{ui}</ChannelCatalogProvider>
    </QueryClientProvider>
  );
}