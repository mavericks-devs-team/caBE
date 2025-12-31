import { useInfiniteQuery } from "@tanstack/react-query";

export interface LeaderboardEntry {
    id: string;
    username: string;
    points: number;
    rank: string;
    profileImageUrl?: string;
}

export interface LeaderboardResponse {
    entries: LeaderboardEntry[];
    nextCursor: number | null;
}

async function fetchLeaderboard({ pageParam }: { pageParam?: number }): Promise<LeaderboardResponse> {
    const limit = 20;
    const url = new URL("/api/leaderboard", window.location.origin);
    url.searchParams.append("limit", limit.toString());

    if (pageParam !== undefined && pageParam !== null) {
        url.searchParams.append("cursor", pageParam.toString());
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
    }

    return response.json();
}

export function useLeaderboard() {
    return useInfiniteQuery({
        queryKey: ["leaderboard"],
        queryFn: fetchLeaderboard,
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });
}
