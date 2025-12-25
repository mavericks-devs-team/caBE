import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { RANKS } from "@shared/schema";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";

// Simple mock for AI scoring if OpenAI integration isn't fully active yet
async function scoreSubmission(taskDescription: string, proof: string): Promise<{ score: number, feedback: string }> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const score = Math.floor(Math.random() * 30) + 70; // 70-100 random score
  return {
    score,
    feedback: "Automated analysis: Good effort! The submission meets the core requirements. Keep building!"
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // -- WIRE UP INTEGRATIONS --
  await setupAuth(app);
  registerAuthRoutes(app);
  registerChatRoutes(app);
  registerImageRoutes(app);

  // -- SEED DATA --
  async function seed() {
    const tasks = await storage.getTasks();
    if (tasks.length === 0) {
      console.log("Seeding tasks...");
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
      await storage.createTask({
        title: "Fix API Endpoint",
        description: "Identify and fix the bug in the provided user authentication endpoint code.",
        category: "Full-Stack",
        difficulty: "Medium",
        points: 350,
        estimatedTime: "1.5 hours",
        tags: ["nodejs", "express", "debugging"]
      });
    }
  }
  seed();

  // -- API ROUTES --

  app.get(api.users.me.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Not authenticated");
    // req.user has structure from replitAuth: { claims: { sub, email, ... } }
    const user = await storage.getUser((req.user as any).claims.sub);
    res.json(user);
  });

  app.get(api.tasks.list.path, async (req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.get(api.tasks.get.path, async (req, res) => {
    const task = await storage.getTask(Number(req.params.id));
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  });

  app.post(api.submissions.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Not authenticated");
    
    const userId = (req.user as any).claims.sub;
    const user = await storage.getUser(userId);
    if (!user) return res.status(401).send("User not found");

    try {
      const input = api.submissions.create.input.parse(req.body);
      const task = await storage.getTask(input.taskId);
      if (!task) return res.status(404).json({ message: "Task not found" });

      // AI SCORING
      const { score, feedback } = await scoreSubmission(task.description, input.proofContent);

      // Save submission
      const submission = await storage.createSubmission({
        ...input,
        userId: user.id,
        status: "approved", 
        score,
        feedback
      });

      // Update User Points & Rank
      const newPoints = user.points + score;
      let newRank = user.rank;

      if (newPoints >= RANKS.PLATINUM.threshold) newRank = RANKS.PLATINUM.name;
      else if (newPoints >= RANKS.GOLD.threshold) newRank = RANKS.GOLD.name;
      else if (newPoints >= RANKS.SILVER.threshold) newRank = RANKS.SILVER.name;
      else newRank = RANKS.BRONZE.name;

      const rankUp = newRank !== user.rank;
      
      await storage.updateUserPoints(user.id, newPoints, newRank);

      res.status(201).json({
        ...submission,
        rankUp,
        newRank
      });

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.submissions.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Not authenticated");
    const userId = (req.user as any).claims.sub;
    const subs = await storage.getUserSubmissions(userId);
    res.json(subs);
  });

  return httpServer;
}
