import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { LeaderboardEntry } from "@/hooks/use-leaderboard";
import { useAuth } from "@/hooks/use-auth";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface LeaderboardTableProps {
    entries: LeaderboardEntry[];
    loading: boolean;
    isFetchingNextPage: boolean;
}

export function LeaderboardTable({ entries, loading, isFetchingNextPage }: LeaderboardTableProps) {
    const { user } = useAuth();

    if (loading && entries.length === 0) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 w-full bg-muted animate-pulse rounded-md" />
                ))}
            </div>
        );
    }

    const getRankBadgeColor = (rank: string) => {
        switch (rank.toLowerCase()) {
            case "platinum": return "bg-slate-300 text-slate-900 border-slate-400"; // Shiny metallic
            case "gold": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "silver": return "bg-slate-100 text-slate-700 border-slate-200";
            case "bronze": return "bg-orange-50 text-orange-800 border-orange-200";
            default: return "bg-primary/10 text-primary";
        }
    };

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Rank</TableHead>
                        <TableHead>Agent</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entries.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No agents found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        entries.map((entry, index) => {
                            const isCurrentUser = user?.uid === entry.id;
                            return (
                                <TableRow
                                    key={entry.id}
                                    className={isCurrentUser ? "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary" : ""}
                                >
                                    <TableCell className="font-medium">
                                        #{index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={entry.profileImageUrl} alt={entry.username} />
                                                <AvatarFallback>{entry.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm flex items-center gap-1">
                                                    {entry.username}
                                                    {isCurrentUser && <span className="text-xs text-muted-foreground">(You)</span>}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`capitalize ${getRankBadgeColor(entry.rank)}`}>
                                            {entry.rank}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold">
                                        {entry.points.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                    {isFetchingNextPage && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-16 text-center text-muted-foreground animate-pulse">
                                Loading more agents...
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
