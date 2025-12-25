import { useUser } from "@/hooks/use-user";
import { useSubmissions } from "@/hooks/use-submissions";
import { RankBadge } from "@/components/ui/RankBadge";
import { format } from "date-fns";
import { 
  Trophy, Target, Calendar, Clock, Loader2, ArrowUpRight 
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, isLoading: userLoading } = useUser();
  const { data: submissions, isLoading: submissionsLoading } = useSubmissions();

  if (userLoading || submissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <a href="/api/login" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all">
          Login to view Dashboard
        </a>
      </div>
    );
  }

  // Calculate Stats
  const totalSubmissions = submissions?.length || 0;
  const approvedSubmissions = submissions?.filter(s => s.status === "approved").length || 0;
  const completionRate = totalSubmissions > 0 ? Math.round((approvedSubmissions / totalSubmissions) * 100) : 0;
  
  // Rank progress logic (Simplified for frontend display)
  const rankThresholds = {
    Bronze: 1000,
    Silver: 5000,
    Gold: 10000,
    Platinum: Infinity
  };
  const nextRankThreshold = rankThresholds[user.rank as keyof typeof rankThresholds] || 1000;
  const progressPercent = Math.min((user.points / nextRankThreshold) * 100, 100);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-7xl mx-auto">
      
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-4 ring-black/50">
            {user.username.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">{user.username}</h1>
              <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground">
                <Calendar className="w-4 h-4" /> 
                <span>Joined {user.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Recently'}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start">
              <RankBadge rank={user.rank} size="md" />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-white">{user.points} XP</span>
              </div>
            </div>
          </div>

          {/* Progress to next rank */}
          <div className="w-full md:w-64 bg-black/20 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Next Rank Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-2 text-right text-xs text-white/50">
              {nextRankThreshold - user.points} XP needed
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium">Tasks Completed</span>
          </div>
          <div className="text-3xl font-display font-bold text-white">{approvedSubmissions}</div>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium">Completion Rate</span>
          </div>
          <div className="text-3xl font-display font-bold text-white">{completionRate}%</div>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium">Current Rank</span>
          </div>
          <div className="text-3xl font-display font-bold text-white">{user.rank}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <h2 className="text-2xl font-display font-bold text-white mb-6">Recent Activity</h2>
      
      {submissions && submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <motion.div 
              key={sub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group p-5 rounded-2xl bg-card/50 border border-border hover:border-primary/30 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border
                  ${sub.status === 'approved' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                    sub.status === 'rejected' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                    'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                  }`}
                >
                  {sub.status === 'approved' ? <Trophy className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-primary transition-colors">
                    {sub.task?.title || "Unknown Task"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Submitted on {sub.createdAt ? format(new Date(sub.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-xs font-bold inline-block mb-1 capitalize
                  ${sub.status === 'approved' ? 'text-green-400 bg-green-900/20' :
                    sub.status === 'rejected' ? 'text-red-400 bg-red-900/20' :
                    'text-yellow-400 bg-yellow-900/20'
                  }`}
                >
                  {sub.status}
                </div>
                {sub.score && (
                  <div className="text-sm font-mono text-muted-foreground">
                    Score: <span className="text-white">{sub.score}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card/30 rounded-3xl border border-white/5">
          <div className="text-muted-foreground mb-4">No submissions yet</div>
          <Link href="/arena">
            <button className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors">
              Go to Arena
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
