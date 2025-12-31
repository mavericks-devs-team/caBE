import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

// Matches the backend API response roughly
export interface FeedbackData {
    score: number;
    status: string; // "approved" | "rejected"
    feedback?: string;
    rankUp?: boolean;
    newRank?: string;
    // earnedPoints is NOT returned by backend currently
}

interface FeedbackPanelProps {
    data: FeedbackData;
    onClose: () => void;
}

export function FeedbackPanel({ data, onClose }: FeedbackPanelProps) {
    const { score, status, feedback, rankUp, newRank } = data;
    const passed = status === "approved";

    // Naive parser for the specific markdown format from backend
    const parsed = parseFeedback(feedback || "");

    return (
        <div className="flex flex-col h-full max-h-[80vh]">
            {/* Header Result */}
            <div className={`text-center p-6 border-b ${passed ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                <div className="mb-2 flex justify-center">
                    {passed ? (
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                    ) : (
                        <XCircle className="h-12 w-12 text-red-500" />
                    )}
                </div>
                <h2 className="text-3xl font-bold font-display mb-1">
                    {passed ? "Submission Passed!" : "Submission Returned"}
                </h2>
                <div className="text-5xl font-bold tracking-tight my-4">
                    {score}<span className="text-2xl text-muted-foreground">/100</span>
                </div>
                {rankUp && (
                    <div className="inline-block px-4 py-1 rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 text-sm font-bold animate-pulse">
                        🎉 Rank Up! Welcome to {newRank}
                    </div>
                )}
            </div>

            <ScrollArea className="flex-1 p-6 space-y-8">

                {/* If we have parsed dimensions to show */}
                {parsed.dimensions.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {parsed.dimensions.map((dim) => (
                            <DimensionBar key={dim.label} label={dim.label} percentage={dim.score} />
                        ))}
                    </div>
                )}

                {/* Detailed Feedback Sections */}
                <div className="space-y-6">
                    <FeedbackSection title="Strengths" items={parsed.strengths} variant="success" />
                    <FeedbackSection title="Areas for Improvement" items={parsed.weaknesses} variant="warning" />

                    {/* Fallback for raw text if parsing found nothing interesting */}
                    {parsed.dimensions.length === 0 && parsed.strengths.length === 0 && (
                        <div className="whitespace-pre-line text-sm text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                            {feedback || "No feedback provided."}
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t bg-card/50 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all"
                >
                    {passed ? "Claim Rewards" : "Try Again"}
                </button>
            </div>
        </div>
    );
}

function DimensionBar({ label, percentage }: { label: string, percentage: number }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="font-medium text-muted-foreground capitalize">{label}</span>
                <span className="font-bold">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
        </div>
    );
}

function FeedbackSection({ title, items, variant }: { title: string, items: string[], variant: 'success' | 'warning' }) {
    if (!items || items.length === 0) return null;
    return (
        <div>
            <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${variant === 'success' ? 'text-green-400' : 'text-yellow-400'}`}>
                {variant === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                {title}
            </h4>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-600 flex-shrink-0" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Helper to extract structure from the specific backend string format
function parseFeedback(text: string) {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const dimensions: { label: string; score: number }[] = [];

    const lines = text.split('\n');
    let mode: 'none' | 'strengths' | 'weaknesses' | 'dimensions' = 'none';

    for (const line of lines) {
        const lower = line.toLowerCase().trim();
        if (lower.includes('strengths:')) { mode = 'strengths'; continue; }
        if (lower.includes('weaknesses:')) { mode = 'weaknesses'; continue; }
        if (lower.includes('dimension scores:')) { mode = 'dimensions'; continue; }

        if (!line.trim() || line.startsWith('**Total Score')) continue;

        if (mode === 'strengths' && line.trim().startsWith('-')) {
            strengths.push(line.replace(/^- /, '').trim());
        } else if (mode === 'weaknesses' && line.trim().startsWith('-')) {
            weaknesses.push(line.replace(/^- /, '').trim());
        } else if (mode === 'dimensions' && line.trim().startsWith('-')) {
            // "- Correctness: 80%"
            const parts = line.replace(/^- /, '').split(':');
            if (parts.length === 2) {
                const label = parts[0].trim();
                const score = parseInt(parts[1].replace('%', '').trim());
                if (!isNaN(score)) {
                    dimensions.push({ label, score });
                }
            }
        }
    }

    return { strengths, weaknesses, dimensions };
}
