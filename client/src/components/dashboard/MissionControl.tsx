import { motion } from "framer-motion";
import { ArrowRight, Crosshair, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { Task } from "@shared/models";

interface MissionControlProps {
    activeTask?: Task;
    recommendedTask?: Task;
    loading?: boolean;
}

export function MissionControl({ activeTask, recommendedTask, loading }: MissionControlProps) {
    if (loading) {
        return (
            <div className="h-48 w-full rounded-3xl bg-card border border-white/5 animate-pulse flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
        );
    }

    const targetTask = activeTask || recommendedTask;

    if (!targetTask) {
        return (
            <div className="w-full rounded-3xl bg-card/50 border border-dashed border-white/10 p-12 text-center mb-8">
                <h3 className="text-xl font-display font-medium text-muted-foreground mb-2">No missions available</h3>
                <p className="text-sm text-muted-foreground/50">Stand by for incoming transmissions.</p>
            </div>
        );
    }

    const isResuming = !!activeTask;

    return (
        <Link href={isResuming ? `/task/${targetTask.id}` : `/arena`}>
            <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="group w-full relative overflow-hidden rounded-3xl bg-card border border-white/10 hover:border-primary/50 transition-colors p-8 md:p-12 mb-8 cursor-pointer shadow-2xl"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${isResuming
                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                : "bg-primary/20 text-primary border border-primary/30"
                                }`}>
                                {isResuming ? "IN PROGRESS" : "NEXT OBJECTIVE"}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                                {targetTask.difficulty} // {targetTask.points} PTS
                            </span>
                        </div>

                        <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-2 group-hover:text-primary transition-colors">
                            {targetTask.title}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl line-clamp-1">
                            {targetTask.description}
                        </p>
                    </div>

                    <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-primary group-hover:text-black border border-white/10 flex items-center justify-center transition-all">
                        {isResuming ? <ArrowRight className="w-8 h-8" /> : <Crosshair className="w-8 h-8" />}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
