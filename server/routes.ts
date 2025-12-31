import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { auth as firebaseAuth } from "./firebase-admin";
import { api } from "@shared/routes";
import { z } from "zod";
import { RANKS } from "@shared/models";
import { AIScoringService } from "./services/aiScorer";

// [DELETED] mock scoreSubmission function


// Middleware to verify Firebase ID token
async function verifyFirebaseToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token provided" });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  console.log("🔧 Registering Firebase-based API routes...");

  // Seed some sample tasks on startup
  async function seedTasks() {
    try {
      const tasks = await storage.getTasks();
      if (tasks.length === 0) {
        console.log("📝 Seeding sample tasks...");

        await storage.createTask({
          title: "Build a Simple Image Classifier",
          description: "Create a neural network using TensorFlow/PyTorch to classify images from the CIFAR-10 dataset.",
          category: "AI/ML",
          difficulty: "Medium",
          points: 400,
          estimatedTime: "2 hours",
          tags: ["neural-networks", "computer-vision"]
        });

        await storage.createTask({
          title: "Deploy a Containerized Microservice",
          description: "Dockerize a simple Node.js app and deploy it to a Kubernetes cluster (or simulated env).",
          category: "Cloud/DevOps",
          difficulty: "Hard",
          points: 600,
          estimatedTime: "3 hours",
          tags: ["kubernetes", "docker", "devops"]
        });

        await storage.createTask({
          title: "Analyze Sales Data",
          description: "Clean and analyze a provided CSV dataset of sales records. Produce 3 key insights.",
          category: "Data Science",
          difficulty: "Easy",
          points: 250,
          estimatedTime: "1 hour",
          tags: ["pandas", "data-analysis"]
        });

        console.log("✅ Sample tasks seeded successfully");
      }
    } catch (error) {
      console.error("⚠️  Seeding failed (this is OK if Firestore isn't configured):", error);
    }
  }

  // Seed tasks (non-blocking)
  seedTasks();

  // -- API ROUTES --

  // Get all tasks (public)
  app.get(api.tasks.list.path, async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
    }
  });

  // Get single task (public)
  app.get(api.tasks.get.path, async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) return res.status(404).json({ message: "Task not found" });
      res.json(task);
    } catch (error: any) {
      console.error("Error fetching task:", error);
      res.status(500).json({ message: "Failed to fetch task", error: error.message });
    }
  });

  // Create submission (requires auth)
  app.post(api.submissions.create.path, verifyFirebaseToken, async (req, res) => {
    try {
      const userId = (req as any).user.uid;
      const input = api.submissions.create.input.parse(req.body);

      const task = await storage.getTask(input.taskId.toString());
      if (!task) return res.status(404).json({ message: "Task not found" });

      // AI SCORING (Real Implementation)
      console.log(`🧠 Evaluating submission for task "${task.title}"...`);
      const aiResult = await AIScoringService.evaluateSubmission(task, {
        proofContent: input.proofContent,
        language: "auto-detect" // or map from user input if available
      });

      // Construct a unified feedback string for now (since shared model expects string)
      // Ideally, we'd update shared/models.ts to support structured feedback, but sticking to contract constraints for now.
      const feedbackString = `
**Total Score: ${aiResult.totalScore}/100** ${aiResult.passed ? "✅" : "❌"}

**Strengths:**
${aiResult.feedback.strengths.map(s => `- ${s}`).join("\n")}

**Weaknesses:**
${aiResult.feedback.weaknesses.map(w => `- ${w}`).join("\n")}

**Dimension Scores:**
- Correctness: ${(aiResult.dimensions.correctness.score * 100).toFixed(0)}%
- Efficiency: ${(aiResult.dimensions.efficiency.score * 100).toFixed(0)}%
- Quality: ${(aiResult.dimensions.quality.score * 100).toFixed(0)}%
- Compliance: ${(aiResult.dimensions.compliance.score * 100).toFixed(0)}%
`.trim();

      // Save submission evaluation first (we want this record regardless)
      const submission = await storage.createSubmission({
        userId,
        taskId: input.taskId.toString(),
        proofContent: input.proofContent,
        status: aiResult.passed ? "approved" : "rejected",
        score: aiResult.totalScore,
        feedback: feedbackString
      });

      // Atomic Progression Update (Points + Rank)
      // Only if passed, naturally.
      let rankUp = false;
      let newRank = "Bronze";
      let earnedPoints = 0;

      if (aiResult.passed) {
        try {
          const result = await storage.processSubmissionResult(
            userId,
            input.taskId.toString(),
            aiResult.totalScore,
            task.points
          );
          rankUp = result.rankUp;
          newRank = result.newRank;
          earnedPoints = result.earnedPoints;

          if (earnedPoints > 0) {
            console.log(`🎉 User ${userId} earned ${earnedPoints} points. Total Rank: ${newRank}`);
          } else {
            console.log(`User ${userId} passed but earned 0 points (already achieved max score or similar).`);
          }

        } catch (e) {
          console.error("Failed to process progression:", e);
          // We don't fail the response, but log the error.
          // In production, we might want a queue or retry.
        }
      }

      res.status(201).json({
        ...submission,
        rankUp,
        newRank
      });

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Submission error:", err);
      res.status(500).json({ message: "Failed to create submission" });
    }
  });

  // --- READ-ONLY API FOR FRONTEND ---

  // Get User Progress Details
  app.get("/api/users/:id/progress", async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentPoints = user.points || 0;
      const currentRankName = user.rank || "Bronze";

      // Determine Next Rank
      // Iterate ranks, find first one with threshold > currentPoints
      // Or strictly next tier.
      // Assumption: RANKS is roughly ordered or we sort it.
      // Models.ts: Bronze:0, Silver:1000, Gold:5000, Plat:10000

      const sortedRanks = Object.values(RANKS).sort((a, b) => a.threshold - b.threshold);
      let nextRank = null;

      for (const r of sortedRanks) {
        if (r.threshold > currentPoints) {
          nextRank = {
            name: r.name,
            threshold: r.threshold,
            pointsRequired: r.threshold - currentPoints
          };
          break;
        }
      }

      // Fetch recent history (limit 5)
      // Fetch recent history (limit 5)
      const recentSubmissions = await storage.getRecentSubmissions(userId, 5);

      // Fetch active/pending submission for the dashboard mission control
      const activeSubmission = await storage.getActiveSubmission(userId);

      // Fetch total submission count for stats
      const totalSubmissions = await storage.getSubmissionCount(userId);

      res.json({
        totalPoints: currentPoints,
        currentRank: currentRankName,
        nextRank,
        recentSubmissions,
        activeSubmission,
        totalSubmissions
      });

    } catch (err) {
      console.error("Error fetching progress:", err);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Get Leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const cursor = req.query.cursor ? parseInt(req.query.cursor as string) : undefined;

      // Safety cap on limit
      const safeLimit = Math.min(limit, 100);

      const entries = await storage.getLeaderboard(safeLimit, cursor);

      // Determine next cursor (points of last entry)
      // Note: Simple cursor on points only works if points are unique or we don't mind overlapping/skipping.
      // Ideally cursor is a composite token, but for this constraint "cursor" in query, we used points.
      // If strictly points, we might miss users with same points.
      // Production robust cursor usually encodes last document snapshot path.
      // Given constraint "endpoints are cheap", we will stick to points for now or 
      // just return the last points as 'nextCursor' suggestion.

      let nextCursor = null;
      if (entries.length > 0) {
        nextCursor = entries[entries.length - 1].points;
      }

      res.json({
        entries,
        nextCursor // Client sends this as ?cursor=...
      });

    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Get user submissions (requires auth)
  app.get(api.submissions.list.path, verifyFirebaseToken, async (req, res) => {
    try {
      const userId = (req as any).user.uid;
      const submissions = await storage.getUserSubmissions(userId);
      res.json(submissions);
    } catch (error: any) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ message: "Failed to fetch submissions", error: error.message });
    }
  });

  console.log("✅ Firebase API routes registered");

  return httpServer;
}
