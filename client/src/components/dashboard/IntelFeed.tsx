import { History, TrendingUp, Trophy } from "lucide-react";

interface IntelFeedProps {
    stats: {
        totalSubmissions: number;
        highestStreak: number;
        lastActivity?: string;
    };
}

export function IntelFeed({ stats }: IntelFeedProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-20">
            <div className="p-5 rounded-2xl bg-card/30 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Completed</span>
                </div>
                <p className="text-xl font-bold text-white">{stats.totalSubmissions}</p>
            </div>

            <div className="p-5 rounded-2xl bg-card/30 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Top Streak</span>
                </div>
                <p className="text-xl font-bold text-white">{stats.highestStreak} Days</p>
            </div>

            <div className="col-span-2 md:col-span-1 p-5 rounded-2xl bg-card/30 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <History className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Last Intel</span>
                    </div>
                    <p className="text-sm font-medium text-white/80">Data Analysis Task</p>
                </div>
                <div className="text-right">
                    <span className="text-xs text-green-400 font-bold">+250 XP</span>
                </div>
            </div>
        </div>
    );
}
