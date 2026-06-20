type TagBadgeProps = {
  children: React.ReactNode;
  tone?: "violet" | "green" | "amber" | "gray";
};

const tones = {
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  gray: "border-line bg-white text-muted"
};

export function TagBadge({ children, tone = "gray" }: TagBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
