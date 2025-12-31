import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/hooks/use-tasks";
import { useUserProgress } from "@/hooks/use-progress";
import { MissionControl } from "@/components/dashboard/MissionControl";
import { IntelFeed } from "@/components/dashboard/IntelFeed";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

import { PublicDashboard } from "@/components/dashboard/PublicDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  // New Progress Hook
  const { data: progress, isLoading: progressLoading } = useUserProgress(user?.uid);

  if (!user) {
    return <PublicDashboard />;
  }

  // Logic to find "Next" task
  // 1. Find the first task that is NOT in submissions (or pending)
  // 2. Prioritize "Easy" or "Medium"
  const completedTaskIds = new Set(
    user.completedTasks ? Object.keys(user.completedTasks) : []
  );

  const activeSubmission = progress?.activeSubmission;
  let activeTask = undefined;
  if (activeSubmission) {
    activeTask = tasks?.find(t => t.id === activeSubmission.taskId);
  }

  const recommendedTask = tasks?.find(t =>
    !completedTaskIds.has(t.id) && (t.difficulty === "Easy" || t.difficulty === "Medium")
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">

      {/* 1. Header & Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Identity & Progress */}
        <div className="md:col-span-2 lg:col-span-1">
          <StatsCard
            totalPoints={progress?.totalPoints || user.points || 0}
            currentRank={progress?.currentRank || user.rank || "Bronze"}
            nextRank={progress?.nextRank || null}
            loading={progressLoading}
          />
        </div>

        {/* Recent Activity Feed */}
        <div className="md:col-span-2">
          <RecentActivity
            submissions={progress?.recentSubmissions || []}
            loading={progressLoading}
          />
        </div>
      </div>

      {/* 2. The Mission (Center - Dominant) */}
      <div className="grid gap-6">
        <MissionControl
          activeTask={activeTask}
          recommendedTask={recommendedTask}
          loading={tasksLoading}
        />
      </div>

      {/* 3. Global Intel (Bottom) */}
      <div className="grid gap-6">
        <IntelFeed
          stats={{
            totalSubmissions: progress?.totalSubmissions || 0,
            highestStreak: 3, // Mock for now
            lastActivity: "Today"
          }}
        />
      </div>

    </div>
  );
}
