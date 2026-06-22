import { cn } from "@/lib/utils";

type Props = {
  categories: string[];
  value: string;
  onChange: (v: string) => void;
};

export function CategoryFilter({ categories, value, onChange }: Props) {
  const all = ["Todas", ...categories];
  return (
    <div className="flex flex-wrap gap-2">
      {all.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={cn(
            "rounded-full border px-3 py-1 text-sm transition-colors",
            value === c
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background hover:bg-accent",
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}