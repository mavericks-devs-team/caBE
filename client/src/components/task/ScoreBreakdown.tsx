import { motion } from "framer-motion";
import { CheckCircle2, Zap, ShieldCheck, Trophy, ArrowRight } from "lucide-react";

interface ScoreBreakdownProps {
    score: {
        total: number;
        breakdown: {
            base: number;
            time: number;
            quality: number;
        };
    };
    onClaim: () => void;
}

export function ScoreBreakdown({ score, onClaim }: ScoreBreakdownProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className="max-w-md mx-auto py-6">
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="inline-block relative"
                >
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    <h2 className="relative text-6xl font-display font-bold text-white mb-2">
                        {score.total}
                    </h2>
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        Total XP Earned
                    </span>
                </motion.div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-3 mb-8"
            >
                <motion.div variants={item} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-gray-300">Mission Complete</span>
                    </div>
                    <span className="font-mono font-bold text-green-400">+{score.breakdown.base}</span>
                </motion.div>

                <motion.div variants={item} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-gray-300">Speed Bonus</span>
                    </div>
                    <span className="font-mono font-bold text-yellow-400">+{score.breakdown.time}</span>
                </motion.div>

                <motion.div variants={item} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-gray-300">System Verified</span>
                    </div>
                    <span className="font-mono font-bold text-blue-400">+{score.breakdown.quality}</span>
                </motion.div>
            </motion.div>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={onClaim}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
            >
                <Trophy className="w-5 h-5" />
                Claim Rewards <ArrowRight className="w-4 h-4" />
            </motion.button>
        </div>
    );
}
