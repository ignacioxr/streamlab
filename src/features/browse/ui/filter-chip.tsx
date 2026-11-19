import Link from "next/link";

export function FilterChip({
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
