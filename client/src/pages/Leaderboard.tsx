import { useLeaderboard } from "@/hooks/use-leaderboard";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

export default function Leaderboard() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError
    } = useLeaderboard();

    // Flatten the pages of entries into a single list
    const entries = data?.pages.flatMap((page) => page.entries) || [];

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="p-3 bg-primary/10 rounded-full">
                    <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Global Leaderboard</h1>
                <p className="text-muted-foreground max-w-lg">
                    See who dominates the arena. Compete for points, climb the tiers, and prove your implementation skills.
                </p>
            </div>

            {/* Main Content */}
            <main className="space-y-6">
                {isError ? (
                    <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg">
                        Failed to load leaderboard. Please try again later.
                    </div>
                ) : (
                    <>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                            <p className="text-yellow-200 text-sm text-center font-mono">
                                ⚠️ DEMO MODE: Showing simulated leaderboard data for MVP testing.
                            </p>
                        </div>

                        <LeaderboardTable
                            entries={entries}
                            loading={isLoading}
                            isFetchingNextPage={isFetchingNextPage}
                        />

                        {/* Pagination / Load More */}
                        {hasNextPage && (
                            <div className="flex justify-center pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                >
                                    {isFetchingNextPage ? "Loading..." : "Load More Agents"}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </main>

        </div>
    );
}
