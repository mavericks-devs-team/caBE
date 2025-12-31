import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { getTaskEquivalent } from "@/lib/progression";
import { RANKS } from "@shared/models";
import { Lock, Shield, Zap, Award } from "lucide-react";

interface RankBannerProps {
    user: {
        username: string;
        rank: string;
        points: number;
    };
}

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function RankBanner({ user }: RankBannerProps) {
    // Determine next rank threshold for progress bar
    let nextThreshold = RANKS.SILVER.threshold;
    let prevThreshold = RANKS.BRONZE.threshold;
    let nextRankName = "Silver";

    if (user.points >= RANKS.GOLD.threshold) {
        nextThreshold = RANKS.PLATINUM.threshold;
        prevThreshold = RANKS.GOLD.threshold;
        nextRankName = "Platinum";
    } else if (user.points >= RANKS.SILVER.threshold) {
        nextThreshold = RANKS.GOLD.threshold;
        prevThreshold = RANKS.SILVER.threshold;
        nextRankName = "Gold";
    }

    const range = nextThreshold - prevThreshold;
    const current = user.points - prevThreshold;
    const progress = Math.min(100, (current / range) * 100);

    const motivationalText = getTaskEquivalent(user.points, user.rank);

    return (
        <TooltipProvider>
            <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-background to-card border border-border p-6 md:p-10 mb-8">
                {/* Background Ambience */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Identity */}
                    <div className="flex items-center gap-6">
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-card border border-white/10 flex items-center justify-center shadow-2xl relative cursor-help">
                                    <Shield className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                                    <div className="absolute -bottom-3 px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-xs font-mono font-bold text-primary uppercase tracking-wider backdrop-blur-md">
                                        {user.rank}
                                    </div>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Current Rank: {user.rank}</p>
                                <p className="text-xs text-muted-foreground">Next Promotion: {nextRankName}</p>
                            </TooltipContent>
                        </Tooltip>

                        <div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-1">
                                {user.username}
                            </h1>
                            <p className="text-muted-foreground font-mono text-sm tracking-wide">
                                OPERATOR STATUS: <span className="text-green-400">ONLINE</span>
                            </p>
                        </div>
                    </div>

                    {/* Progression */}
                    <div className="flex-1 max-w-md">
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-sm font-medium text-white/80">
                                {motivationalText}
                            </span>
                            <Tooltip>
                                <TooltipTrigger>
                                    <span className="text-xs font-mono text-muted-foreground cursor-help decoration-dotted underline underline-offset-4">
                                        {user.points} / {nextThreshold} XP
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Gap to promotion: {nextThreshold - user.points} XP</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Progress value={progress} className="h-3" />
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
