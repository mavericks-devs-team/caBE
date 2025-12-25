import type { Express } from "express";
import type { Server } from "http";
import { firebaseStorage } from "./firebase-storage";
import { auth as firebaseAuth } from "./firebase-admin";
import { api } from "@shared/routes";
import { z } from "zod";
import { RANKS } from "@shared/schema";

// Simple mock for AI scoring
async function scoreSubmission(taskDescription: string, proof: string): Promise<{ score: number, feedback: string }> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const score = Math.floor(Math.random() * 30) + 70; // 70-100 random score
  return {
    score,
    feedback: "Automated analysis: Good effort! The submission meets the core requirements. Keep building!"
  };
}

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
      const tasks = await firebaseStorage.getTasks();
      if (tasks.length === 0) {
        console.log("📝 Seeding sample tasks...");

        await firebaseStorage.createTask({
          title: "Build a Simple Image Classifier",
          description: "Create a neural network using TensorFlow/PyTorch to classify images from the CIFAR-10 dataset.",
          category: "AI/ML",
          difficulty: "Medium",
          points: 400,
          estimatedTime: "2 hours",
          tags: ["neural-networks", "computer-vision"]
        });

        await firebaseStorage.createTask({
          title: "Deploy a Containerized Microservice",
          description: "Dockerize a simple Node.js app and deploy it to a Kubernetes cluster (or simulated env).",
          category: "Cloud/DevOps",
          difficulty: "Hard",
          points: 600,
          estimatedTime: "3 hours",
          tags: ["kubernetes", "docker", "devops"]
        });

        await firebaseStorage.createTask({
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
      const tasks = await firebaseStorage.getTasks();
      res.json(tasks);
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
    }
  });

  // Get single task (public)
  app.get(api.tasks.get.path, async (req, res) => {
    try {
      const task = await firebaseStorage.getTask(req.params.id);
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

      const task = await firebaseStorage.getTask(input.taskId.toString());
      if (!task) return res.status(404).json({ message: "Task not found" });

      // AI SCORING
      const { score, feedback } = await scoreSubmission(task.description, input.proofContent);

      // Save submission to Firestore
      const submission = await firebaseStorage.createSubmission({
        userId,
        taskId: input.taskId.toString(),
        proofContent: input.proofContent,
        status: "approved",
        score,
        feedback
      });

      // TODO: Update user points in Firestore (implement later)
      // For now, just return the submission
      res.status(201).json({
        ...submission,
        rankUp: false,
        newRank: "Bronze"
      });

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Submission error:", err);
      res.status(500).json({ message: "Failed to create submission" });
    }
  });

  // Get user submissions (requires auth)
  app.get(api.submissions.list.path, verifyFirebaseToken, async (req, res) => {
    try {
      const userId = (req as any).user.uid;
      const submissions = await firebaseStorage.getUserSubmissions(userId);
      res.json(submissions);
    } catch (error: any) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ message: "Failed to fetch submissions", error: error.message });
    }
  });

  console.log("✅ Firebase API routes registered");

  return httpServer;
}
