import { Category, CategorySchema } from "@/domain/channel";

export function parseCategoryParam(
  value: string | string[] | undefined
): Category | undefined {
  if(typeof value !== "string") return undefined;

  const result = CategorySchema.safeParse(value);
  return result.success ? result.data : undefined;
}