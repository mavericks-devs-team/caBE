import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, CircleX, Clock } from "lucide-react";
import type { RecentSubmission } from "@/hooks/use-progress";
// Basic relative time helper
function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

interface RecentActivityProps {
    submissions: RecentSubmission[];
    loading: boolean;
}

export function RecentActivity({ submissions, loading }: RecentActivityProps) {
    if (loading) {
        return <div className="h-48 w-full bg-muted animate-pulse rounded-lg" />;
    }

    return (
        <Card className="h-full shadow-md border-border/50">
            <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[200px] px-6 pb-4">
                    {submissions.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8 text-sm">
                            No recent submissions.
                            <br />
                            Time to write some code!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {submissions.map((submission) => (
                                <div key={submission.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        {submission.status === "approved" ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <CircleX className="h-4 w-4 text-red-500" />
                                        )}
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium group-hover:text-primary transition-colors">
                                                {submission.taskTitle}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {timeAgo(submission.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`text-xs font-bold ${submission.status === "approved" ? 'text-green-600' : 'text-red-500'}`}>
                                        {submission.score}/100
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
