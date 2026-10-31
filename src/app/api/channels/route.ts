import { CategorySchema } from "@/domain/channel";
import { seedChannelCatalog } from "@/infrastructure/server/seed-channel-catalog";
import z from "zod";

const QuerySchema = z.object({
  category: CategorySchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24)
});

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = QuerySchema.safeParse(params);

  if(!parsed.success) {
    return Response.json(
      { error: "Invalid query", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const channels = await seedChannelCatalog.listLive(parsed.data);
  return Response.json(channels);
}