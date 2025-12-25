import { clsx } from "clsx";

type Rank = "Bronze" | "Silver" | "Gold" | "Platinum";

interface RankBadgeProps {
  rank: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function RankBadge({ rank, size = "md", showLabel = true }: RankBadgeProps) {
  const normalizedRank = (rank.charAt(0).toUpperCase() + rank.slice(1).toLowerCase()) as Rank;

  const styles = {
    Bronze: "border-[hsl(var(--rank-bronze))] text-[hsl(var(--rank-bronze))] shadow-[0_0_10px_hsl(var(--rank-bronze)/0.2)]",
    Silver: "border-[hsl(var(--rank-silver))] text-[hsl(var(--rank-silver))] shadow-[0_0_10px_hsl(var(--rank-silver)/0.2)]",
    Gold: "border-[hsl(var(--rank-gold))] text-[hsl(var(--rank-gold))] shadow-[0_0_10px_hsl(var(--rank-gold)/0.2)]",
    Platinum: "border-[hsl(var(--rank-platinum))] text-[hsl(var(--rank-platinum))] shadow-[0_0_10px_hsl(var(--rank-platinum)/0.2)] bg-gradient-to-r from-[hsl(var(--rank-platinum)/0.1)] to-transparent",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs border",
    md: "px-3 py-1 text-sm border-2",
    lg: "px-6 py-2 text-xl border-2 font-bold tracking-widest",
  };

  return (
    <div className={clsx(
      "font-display uppercase rounded-full inline-flex items-center justify-center backdrop-blur-sm",
      styles[normalizedRank] || styles.Bronze,
      sizes[size]
    )}>
      {showLabel ? normalizedRank : normalizedRank.charAt(0)}
    </div>
  );
}
