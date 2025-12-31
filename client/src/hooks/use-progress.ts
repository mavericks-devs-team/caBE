import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";

export interface NextRank {
    name: string;
    threshold: number;
    pointsRequired: number;
}

export interface RecentSubmission {
    id: string;
    taskId: string;
    taskTitle: string;
    score: number;
    status: string;
    createdAt: string; // ISO string
}

export interface UserProgress {
    totalPoints: number;
    currentRank: string;
    nextRank: NextRank | null;
    recentSubmissions: RecentSubmission[];
    activeSubmission?: RecentSubmission;
    totalSubmissions: number;
}

async function fetchUserProgress(userId: string): Promise<UserProgress> {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    const response = await fetch(`/api/users/${userId}/progress`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user progress");
    }

    return response.json();
}

export function useUserProgress(userId?: string) {
    return useQuery({
        queryKey: ["userProgress", userId],
        queryFn: () => fetchUserProgress(userId!),
        enabled: !!userId,
    });
}
