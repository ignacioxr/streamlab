import { Category, CATEGORY_LABELS, CategorySchema } from "@/domain/channel";
import Link from "next/link";

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

function FilterChip({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={isActive ? "page" : undefined}
      className={`inline-flex h-8 items-center rounded-full px-3 text-sm font-medium transition-colors ${
        isActive
          ? "bg-white text-neutral-900"
          : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
      }`}
    >
      {label}
    </Link>
  );
}
