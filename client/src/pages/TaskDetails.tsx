import { useParams, useLocation } from "wouter";
import { useTask } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";
import { useCreateSubmission } from "@/hooks/use-submissions";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft, UploadCloud, CheckCircle, AlertCircle, Loader2, Tag
} from "lucide-react";
import { Link } from "wouter";
import { ProcessingOverlay } from "@/components/task/ProcessingOverlay";
import { ScoreBreakdown } from "@/components/task/ScoreBreakdown";

type SubmissionState = "IDLE" | "PROCESSING" | "SCORE_REVEAL";

export default function TaskDetails() {
  const { id } = useParams();
  const taskId = Number(id);
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { data: task, isLoading } = useTask(taskId);

  const [proof, setProof] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("IDLE");
  const [earnedScore, setEarnedScore] = useState<{ total: number; breakdown: any } | null>(null);

  const createSubmission = useCreateSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = "/api/login";
      return;
    }

    // 1. Start Friction Phase
    setSubmissionState("PROCESSING");

    try {
      // 2. Parallel Execution: API Call + Min Wait Time
      const minWait = new Promise(resolve => setTimeout(resolve, 3500)); // 3.5s friction
      const submissionPromise = createSubmission.mutateAsync({
        userId: user.uid,
        taskId,
        proofContent: proof,
      });

      const [_, result] = await Promise.all([minWait, submissionPromise]);

      // 3. Prepare Score Data (Mock breakdown for now if not in API)
      setEarnedScore({
        total: result.score || task?.points || 0,
        breakdown: {
          base: (task?.points || 0),
          time: 0, // Future: Calc based on est. time
          quality: 0 // Future: Linter bonus
        }
      });

      // 4. Reveal Score
      setSubmissionState("SCORE_REVEAL");

    } catch (error) {
      console.error(error);
      setSubmissionState("IDLE");
      // TODO: Show error toast
    }
  };

  const handleClaim = () => {
    setIsDialogOpen(false);
    setSubmissionState("IDLE");
    setProof("");

    // Fire Confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#7C3AED', '#22D3EE', '#FFFFFF']
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h2 className="text-2xl text-white">Task not found</h2>
        <Link href="/arena" className="text-primary hover:underline mt-4 block">Return to Arena</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-5xl mx-auto">
      <Link href="/arena" className="inline-flex items-center text-muted-foreground hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Arena
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Background Light based on Difficulty */}
            <div className={`absolute -top-20 -right-20 w-64 h-64 blur-[80px] rounded-full pointer-events-none opacity-20
              ${task.difficulty === 'Easy' ? 'bg-green-500' :
                task.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}
            />

            <div className="relative">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-sm font-semibold">
                  {task.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border
                  ${task.difficulty === 'Easy' ? 'text-green-400 bg-green-900/20 border-green-500/20' :
                    task.difficulty === 'Medium' ? 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20' :
                      'text-red-400 bg-red-900/20 border-red-500/20'}`
                }>
                  {task.difficulty}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                {task.title}
              </h1>

              <div className="prose prose-invert prose-lg max-w-none mb-8">
                <p className="whitespace-pre-line text-gray-300 leading-relaxed">{task.description}</p>
              </div>

              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                  {task.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-muted-foreground text-xs font-mono">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 sticky top-24"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="text-center w-1/2 border-r border-border/50">
                <div className="text-3xl font-display font-bold text-primary">{task.points}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">XP Points</div>
              </div>
              <div className="text-center w-1/2">
                <div className="text-3xl font-display font-bold text-white">{task.estimatedTime}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Est. Time</div>
              </div>
            </div>

            {user ? (
              <button
                onClick={() => setIsDialogOpen(true)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:to-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <UploadCloud className="w-5 h-5" />
                Submit Solution
              </button>
            ) : (
              <a href="/api/login" className="block w-full">
                <button className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-100 transition-colors cursor-pointer">
                  Login to Submit
                </button>
              </a>
            )}

            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <h4 className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
                <AlertCircle className="w-4 h-4" /> Submission Rules
              </h4>
              <ul className="text-sm text-blue-200/70 space-y-1 list-disc list-inside">
                <li>Provide a direct link to your code/work.</li>
                <li>Original work only. Plagiarism = Ban.</li>
                <li>Ensure access permissions are public.</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {isDialogOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => submissionState === "IDLE" && setIsDialogOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden"
            >

              {/* STATE: PROCESSING */}
              {submissionState === "PROCESSING" && (
                <ProcessingOverlay />
              )}

              {/* STATE: SCORE REVEAL */}
              {submissionState === "SCORE_REVEAL" && earnedScore && (
                <ScoreBreakdown score={earnedScore} onClaim={handleClaim} />
              )}

              {/* STATE: IDLE (FORM) */}
              {submissionState === "IDLE" && (
                <>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">Submit Your Work</h3>
                  <p className="text-muted-foreground mb-6">
                    Paste the URL to your solution (GitHub, Replit, Figma, etc.)
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4 mb-8">
                      <textarea
                        required
                        value={proof}
                        onChange={(e) => setProof(e.target.value)}
                        placeholder="https://github.com/username/repo..."
                        className="w-full h-32 px-4 py-3 rounded-xl bg-black/20 border border-border text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none font-mono text-sm"
                      />
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-gray-600 bg-transparent text-primary focus:ring-primary/50" />
                        <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">
                          I certify that this submission is my own original work and adheres to the community guidelines.
                        </span>
                      </label>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsDialogOpen(false)}
                        className="px-5 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirm Submission
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
