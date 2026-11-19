import { ChannelCardSkeleton } from "./channel-card-skeleton";
import { CHANNEL_GRID_CLASS } from "./grid-layout";

export function ChannelGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div aria-busy="true">
      <span className="sr-only">Loading channels</span>
      <div className={`${CHANNEL_GRID_CLASS} motion-safe:animate-pulse`}>
        {Array.from({ length: count }, (_, i) => (
          <ChannelCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
