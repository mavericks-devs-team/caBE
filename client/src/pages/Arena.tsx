import { useTasks } from "@/hooks/use-tasks";
import { useSubmissions } from "@/hooks/use-submissions";
import { TaskCard } from "@/components/ui/TaskCard";
import { Lock, Star, Zap, ShieldAlert, Crosshair } from "lucide-react";
import { motion } from "framer-motion";

export default function Arena() {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: submissions } = useSubmissions();

  const completedTaskIds = new Set(
    submissions?.filter(s => s.status === "approved").map(s => s.taskId) || []
  );

  // ZONES LOGIC
  // 1. Mission: First non-completed Medium task (or Easy if no Medium)
  // 2. Training: All Easy tasks
  // 3. High Stakes: Medium + Hard tasks

  const availableTasks = tasks?.filter(t => !completedTaskIds.has(t.id)) || [];

  // Mission Logic
  const missionTask = availableTasks.find(t => t.difficulty === "Medium") || availableTasks[0];

  // Zone 1: Training (Easy, excluding mission)
  const trainingTasks = availableTasks.filter(t => t.difficulty === "Easy" && t.id !== missionTask?.id);

  // Zone 2: High Stakes (Medium/Hard, excluding mission)
  const highStakesTasks = availableTasks.filter(t => (t.difficulty === "Medium" || t.difficulty === "Hard") && t.id !== missionTask?.id);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">The Arena</h1>
        <p className="text-muted-foreground">Select your battlefield.</p>
      </div>

      {tasksLoading ? (
        <div className="animate-pulse h-64 bg-card/30 rounded-3xl" />
      ) : (
        <div className="space-y-16">

          {/* 1. RECOMMENDED MISSION */}
          {missionTask && (
            <section>
              <div className="flex items-center gap-2 mb-4 text-primary">
                <Crosshair className="w-5 h-5" />
                <h2 className="text-lg font-mono font-bold uppercase tracking-wider">Priority Assignment</h2>
              </div>
              <div className="p-1 rounded-3xl bg-gradient-to-r from-primary/50 via-primary/20 to-transparent">
                <div className="bg-background rounded-[22px]">
                  <TaskCard task={missionTask} isHero />
                </div>
              </div>
            </section>
          )}

          {/* 2. ZONE 1: TRAINING GROUNDS */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <ShieldAlert className="w-5 h-5 text-green-400" />
              <div>
                <h2 className="text-xl font-bold text-white">Training Grounds</h2>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Low Risk • Steady Progress</p>
              </div>
            </div>

            {trainingTasks.length > 0 ? (
              <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 snap-x no-scrollbar md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:px-0">
                {trainingTasks.map(task => (
                  <div key={task.id} className="min-w-[300px] snap-center">
                    <TaskCard task={task} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-card/20 border border-white/5 text-center text-muted-foreground text-sm">
                Sector Cleared. No basic training modules remaining.
              </div>
            )}
          </section>

          {/* 3. ZONE 2: HIGH STAKES */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-yellow-500" />
              <div>
                <h2 className="text-xl font-bold text-white">High Stakes Sector</h2>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Maximum Glory • High Difficulty</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highStakesTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}

              {/* CLASSIFIED / LOCKED */}
              <div className="h-full min-h-[200px] rounded-2xl bg-card/10 border border-white/5 flex flex-col items-center justify-center text-muted-foreground/50 gap-3 p-6 text-center">
                <Lock className="w-8 h-8 opacity-50" />
                <div>
                  <div className="font-mono font-bold text-sm">CLASSIFIED</div>
                  <div className="text-xs mt-1">Requires GOLD Rank</div>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
