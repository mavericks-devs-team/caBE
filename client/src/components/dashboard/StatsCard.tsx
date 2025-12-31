import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target } from "lucide-react";
import type { NextRank } from "@/hooks/use-progress";

interface StatsCardProps {
    totalPoints: number;
    currentRank: string;
    nextRank: NextRank | null;
    loading: boolean;
}

export function StatsCard({ totalPoints, currentRank, nextRank, loading }: StatsCardProps) {
    if (loading) {
        return <div className="h-48 w-full bg-muted animate-pulse rounded-lg" />;
    }

    // Calculate percentage
    let percentage = 100;
    if (nextRank) {
        // Basic linear progress: (points / next_threshold) * 100
        // Or relative to current rank tier start? keeping it simple for now.
        percentage = Math.min(100, (totalPoints / nextRank.threshold) * 100);
    }

    return (
        <Card className="shadow-lg border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rank Progress</CardTitle>
                <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline space-x-2">
                    <div className="text-3xl font-bold text-primary">{totalPoints}</div>
                    <div className="text-sm text-muted-foreground">points</div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-primary">{currentRank}</span>
                    {nextRank ? (
                        <span className="text-muted-foreground">{nextRank.name} ({nextRank.threshold})</span>
                    ) : (
                        <span className="text-muted-foreground">Max Rank</span>
                    )}
                </div>

                <Progress value={percentage} className="h-2 mb-2" />

                {nextRank && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {nextRank.pointsRequired} points to level up
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
