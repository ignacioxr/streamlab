import { Channel } from "@/domain/channel";
import { formatCompactNumber } from "@/shared/lib/format-compact-number";
import Image from "next/image";
import Link from "next/link";

export const CHANNEL_CARD_SIZES =
  "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

type ChannelCardProps = {
  channel: Channel;
  /** First visible row: load immediately with high fetch priority (LCP candidates). */
  eager?: boolean;
};

export function ChannelCard({ channel, eager = false }: ChannelCardProps) {
  return (
    <article className="group">
      <Link
        href={`/channels/${channel.id}`}
        className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
      >
        <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-800">
          <Image
            src={channel.thumbnailUrl}
            alt=""
            fill
            sizes={CHANNEL_CARD_SIZES}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
          {channel.isLive && (
            <>
              <span className="absolute left-2 top-2 rounded bg-red-600 px-1.5 py-0.5 text-xs font-semibold uppercase text-white">
                Live
              </span>
              <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-xs tabular-nums text-white">
                {formatCompactNumber(channel.viewerCount)} viewers
              </span>
            </>
          )}
        </div>
        <h3 className="mt-2 line-clamp-1 text-sm font-semibold">
          {channel.title}
        </h3>
      </Link>
      <p className="line-camp-1 text-sm text-neutral-400">{channel.streamerName}</p>
      <p className="line-camp-1 text-xs text-neutral-500">{channel.category}</p>
    </article>
  );
}
