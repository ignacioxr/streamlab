import { CHANNEL_GRID_CLASS } from "./grid-layout";

function ChannelCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="aspect-video rounded-lg bg-neutral-800" />
      <div className="mt-2 flex h-5 items-center">
        <div className="h-3.5 w-3/4 rounded bg-neutral-800" />
      </div>
      <div className="flex h-5 items-center">
        <div className="h-3 w-1/2 rounded bg-neutral-800" />
      </div>
      <div className="flex h-4 items-center">
        <div className="h-2.5 w-1/4 rounded bg-neutral-800" />
      </div>
    </div>
  );
}

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
