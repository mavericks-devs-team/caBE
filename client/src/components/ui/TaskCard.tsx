import { Link } from "wouter";
import { type Task } from "@shared/schema";
import { Clock, BarChart, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface TaskCardProps {
  task: Task;
  isCompleted?: boolean;
}

export function TaskCard({ task, isCompleted }: TaskCardProps) {
  const difficultyColor = {
    Easy: "text-green-400 bg-green-400/10 border-green-400/20",
    Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    Hard: "text-red-400 bg-red-400/10 border-red-400/20",
  }[task.difficulty] || "text-gray-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.15)] transition-all"
    >
      {isCompleted && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-green-500/20 text-green-400 p-1.5 rounded-full border border-green-500/50 shadow-[0_0_10px_rgba(74,222,128,0.3)]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col h-full">
        {/* Header Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${difficultyColor}`}>
            {task.difficulty}
          </span>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-secondary/10 text-secondary border border-secondary/20">
            {task.category}
          </span>
        </div>

        {/* Title & Desc */}
        <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-primary transition-colors">
          {task.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
          {task.description}
        </p>

        {/* Footer Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
          <div className="flex gap-4 text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-1.5">
              <BarChart className="w-3.5 h-3.5" />
              <span>{task.points} XP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{task.estimatedTime}</span>
            </div>
          </div>

          <Link href={`/task/${task.id}`}>
            <button className="flex items-center gap-1 text-sm font-semibold text-white group-hover:text-secondary transition-colors cursor-pointer">
              View Task <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
