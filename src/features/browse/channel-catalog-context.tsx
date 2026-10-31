"use client"

import { createContext, type ReactNode, use } from "react";
import type { ChannelCatalog } from "@/domain/channel";

const ChannelCatalogContext = createContext<ChannelCatalog | null>(null);

export function ChannelCatalogProvider({
  catalog, 
  children
}: {
  catalog: ChannelCatalog,
  children: ReactNode
}) {
  return (
    <ChannelCatalogContext value={catalog}>{children}</ChannelCatalogContext>
  );
}

export function useChannelCatalog(): ChannelCatalog {
  const catalog = use(ChannelCatalogContext);
  if(!catalog) {
    throw new Error("useChannelCatalog must be used inside ChannelCatalogProvider");
  }

  return catalog;
}
