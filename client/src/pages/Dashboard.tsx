import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/hooks/use-tasks";
import { useSubmissions } from "@/hooks/use-submissions";
import { RankBanner } from "@/components/dashboard/RankBanner";
import { MissionControl } from "@/components/dashboard/MissionControl";
import { IntelFeed } from "@/components/dashboard/IntelFeed";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: submissions } = useSubmissions();

  if (!user) return null;

  // Logic to find "Next" task
  // 1. Find the first task that is NOT in submissions
  // 2. Prioritize "Easy" or "Medium"
  const completedTaskIds = new Set(
    submissions?.filter(s => s.status === "approved").map(s => s.taskId) || []
  );

  const activeSubmission = submissions?.find(s => s.status === "pending");
  let activeTask = undefined;
  if (activeSubmission) {
    activeTask = tasks?.find(t => t.id === activeSubmission.taskId);
  }

  const recommendedTask = tasks?.find(t =>
    !completedTaskIds.has(t.id) && (t.difficulty === "Easy" || t.difficulty === "Medium")
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center">

      {/* 1. Identity & Context (Top) */}
      <RankBanner
        user={{
          rank: user?.rank || "Bronze",
          points: user?.points || 0,
          username: user?.username || user?.displayName || "Guest",
          role: user?.role || "user",
          email: user?.email || "",
          uid: user?.uid || "",
          createdAt: null,
          updatedAt: null,
        } as any}
      />

      {/* 2. The Mission (Center - Dominant) */}
      <MissionControl
        activeTask={activeTask}
        recommendedTask={recommendedTask}
        loading={tasksLoading}
      />

      {/* 3. Recent Intel (Bottom - Subtle) */}
      <IntelFeed
        stats={{
          totalSubmissions: submissions?.length || 0,
          highestStreak: 3, // Mock for now
          lastActivity: "Today"
        }}
      />

    </div>
  );
}
