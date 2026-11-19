import { Category, CATEGORY_LABELS, CategorySchema } from "@/domain/channel";
import { FilterChip } from "./filter-chip";

type ActiveFilter = Category | "all";

export function CategoryFilter({ active }: { active?: ActiveFilter }) {
  return (
    <nav aria-label="Filter by category" className="mb-4">
      <ul className="flex flex-wrap gap-2">
        <li>
          <FilterChip href="/" label="All" isActive={active === "all"} />
        </li>
        {CategorySchema.options.map((category) => (
          <li key={category}>
            <FilterChip
              href={`/?category=${category}`}
              label={CATEGORY_LABELS[category]}
              isActive={active === category}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
