import z from "zod";

export const CategorySchema = z.enum([
  "gaming",
  "music",
  "art",
  "just-chatting",
  "sports",
  "creative"
]);

export const ChannelSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  streamerName: z.string().min(1),
  category: CategorySchema,
  thumbnailUrl: z.url(),
  viewerCount: z.int().nonnegative(),
  isLive: z.boolean()
});

export type Category = z.infer<typeof CategorySchema>;
export type Channel = z.infer<typeof ChannelSchema>;