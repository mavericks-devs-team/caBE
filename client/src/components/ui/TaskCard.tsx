import { Link } from "wouter";
import { type Task } from "@shared/schema";
import { Clock, BarChart, ChevronRight, CheckCircle2, FileText, Crosshair } from "lucide-react";
import { motion } from "framer-motion";

interface TaskCardProps {
  task: Task;
  isCompleted?: boolean;
  isHero?: boolean;
}

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function TaskCard({ task, isCompleted, isHero }: TaskCardProps) {
  const difficultyColors = {
    Easy: {
      border: "border-green-500/30",
      bg: "bg-green-500/5",
      text: "text-green-400",
      glow: "group-hover:shadow-[0_0_20px_-5px_hsla(142,71%,45%,0.15)]",
    },
    Medium: {
      border: "border-yellow-500/30",
      bg: "bg-yellow-500/5",
      text: "text-yellow-400",
      glow: "group-hover:shadow-[0_0_20px_-5px_hsla(48,96%,53%,0.15)]",
    },
    Hard: {
      border: "border-red-500/30",
      bg: "bg-red-500/5",
      text: "text-red-400",
      glow: "group-hover:shadow-[0_0_20px_-5px_hsla(0,72%,51%,0.15)]",
    },
  }[task.difficulty] || { border: "border-gray-500/30", bg: "bg-gray-500/5", text: "text-gray-400", glow: "" };

  return (
    <Link href={`/task/${task.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={`
          group relative flex flex-col overflow-hidden rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer
          ${difficultyColors.border} ${difficultyColors.bg} ${difficultyColors.glow}
          ${isHero ? "p-8 md:flex-row md:items-center md:gap-10 bg-card/40" : "p-6 h-full bg-card/20 hover:bg-card/30"}
        `}
      >
        {/* Status Overlay */}
        {isCompleted && (
          <div className="absolute top-4 right-4 z-20">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Complete
            </div>
          </div>
        )}

        {/* 1. The Class (Top Left Badge) */}
        {!isHero && (
          <div className="absolute top-0 left-0">
            <div className={`px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest border-b border-r rounded-br-lg ${difficultyColors.border} ${difficultyColors.text} bg-black/20`}>
              Class: {task.difficulty}
            </div>
          </div>
        )}

        {/* Hero-specific Left Side (Context) */}
        {isHero && (
          <div className="flex-shrink-0 mb-6 md:mb-0">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Crosshair className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 h-full pt-4">

          {/* 2. The Bounty (Top Right - Visually displaced to align with grid) */}
          <div className="flex items-start justify-between mb-4">
            <div className={`text-xs font-mono text-muted-foreground uppercase tracking-wider ${isHero ? "mb-1" : ""}`}>
              {task.category}
            </div>

            {!isCompleted && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">REWARD</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className={`font-display font-bold text-lg ${difficultyColors.text} cursor-help border-b border-dashed border-white/20`}>
                        {task.points} XP
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs space-y-1">
                        <p>Base Reward: {Math.floor(task.points * 0.8)} XP</p>
                        <p className="text-primary">Bonus Pot: {Math.ceil(task.points * 0.2)} XP</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {isHero && <span className="px-2 py-0.5 ml-2 text-[10px] bg-red-500/20 text-red-500 border border-red-500/30 rounded uppercase font-bold tracking-wider">Priority</span>}
              </div>
            )}
          </div>

          {/* 3. The Target (Title) */}
          <h3 className={`font-display font-bold text-white group-hover:text-primary transition-colors leading-tight mb-2 ${isHero ? "text-3xl" : "text-xl"}`}>
            {task.title}
          </h3>

          <p className={`text-muted-foreground line-clamp-2 mb-6 font-light ${isHero ? "text-lg max-w-2xl" : "text-sm"}`}>
            {task.description}
          </p>

          {/* 4. The Intel (Footer) */}
          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>EST. TIME: {task.estimatedTime}</span>
            </div>

            {/* 5. CTA (Slide in on hover) */}
            <div className="flex items-center gap-2 text-xs font-bold text-primary opacity-60 group-hover:opacity-100 transition-opacity">
              <FileText className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider">Inspect Contract</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
