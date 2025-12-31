import { RANKS } from "@shared/models";

export function getTaskEquivalent(currentPoints: number, currentRank: string) {
    // Determine next rank
    let nextRankName = "";
    let nextRankThreshold = 0;

    if (currentPoints < RANKS.SILVER.threshold) {
        nextRankName = RANKS.SILVER.name;
        nextRankThreshold = RANKS.SILVER.threshold;
    } else if (currentPoints < RANKS.GOLD.threshold) {
        nextRankName = RANKS.GOLD.name;
        nextRankThreshold = RANKS.GOLD.threshold;
    } else if (currentPoints < RANKS.PLATINUM.threshold) {
        nextRankName = RANKS.PLATINUM.name;
        nextRankThreshold = RANKS.PLATINUM.threshold;
    } else {
        return "Max Rank Achieved";
    }

    const gap = nextRankThreshold - currentPoints;
    if (gap <= 0) return "Rank Up Ready";

    // Logic: 
    // Gap > 600 -> Hard Tasks (600)
    // Gap > 400 -> Medium Tasks (400)
    // Else -> Easy Tasks (250)

    let denominator = 250;
    let difficulty = "Easy";
    let label = "Easy";

    if (gap > 600) {
        denominator = 600;
        difficulty = "Hard";
        label = "Hard";
    } else if (gap > 400) {
        denominator = 400;
        difficulty = "Medium";
        label = "Medium";
    }

    const count = Math.ceil(gap / denominator);
    const taskLabel = count === 1 ? "Submission" : "Submissions";

    // Special case for "1 Solid Submission"
    if (count === 1 && difficulty !== "Easy") {
        return `1 Solid Submission to ${nextRankName}`;
    }

    return `${count} ${label} ${taskLabel} to ${nextRankName}`;
}
