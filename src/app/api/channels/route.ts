import { CategorySchema } from "@/domain/channel";
import { seedChannelCatalog } from "@/infrastructure/server/seed-channel-catalog";
import z from "zod";

const QuerySchema = z.object({
  category: CategorySchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24)
});

function toParamRecord(searchParams: URLSearchParams) {
  const params: Record<string, string | string[] | undefined> = {};

  for(const key of new Set(searchParams.keys())) {
    const values = searchParams.getAll(key);
    params[key] = values.length > 1 ? values : values[0];
  }

  return params;
}

export async function GET(request: Request) {
  const params = toParamRecord(new URL(request.url).searchParams);
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