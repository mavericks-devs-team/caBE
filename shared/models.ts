import { z } from "zod";

// --- AUTH ---
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().optional(),
  username: z.string().optional(),
  rank: z.string().default("Bronze"),
  points: z.number().default(0),
  completedTasks: z.record(z.number()).optional(), // taskId -> maxScore
  role: z.string().default("user"), // 'user' | 'admin'
  createdAt: z.date().or(z.string()).optional(), // Firestore timestamps
  updatedAt: z.date().or(z.string()).optional(),
});

export type User = z.infer<typeof userSchema>;
export type UpsertUser = Partial<User>;

// --- TASKS ---
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  difficulty: z.string(),
  points: z.number(),
  estimatedTime: z.string(),
  tags: z.array(z.string()).optional(),
  createdAt: z.date().or(z.string()).optional(),
});

export const insertTaskSchema = taskSchema.omit({ id: true, createdAt: true });

export type Task = z.infer<typeof taskSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;

// --- SUBMISSIONS ---
export const submissionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  taskId: z.string(),
  proofContent: z.string(),
  status: z.string().default("pending"),
  score: z.number().default(0),
  feedback: z.string().optional(),
  createdAt: z.date().or(z.string()).optional(),
});

export const insertSubmissionSchema = submissionSchema.omit({
  id: true,
  createdAt: true,
  status: true,
  score: true,
  feedback: true
});

export type Submission = z.infer<typeof submissionSchema>;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;

// --- CHAT ---
export const conversationSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.date().or(z.string()).optional(),
});
export type Conversation = z.infer<typeof conversationSchema>;

export const messageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  role: z.string(),
  content: z.string(),
  createdAt: z.date().or(z.string()).optional(),
});
export type Message = z.infer<typeof messageSchema>;

// --- RANKS ---
export const RANKS = {
  BRONZE: { name: "Bronze", threshold: 0 },
  SILVER: { name: "Silver", threshold: 1000 },
  GOLD: { name: "Gold", threshold: 5000 },
  PLATINUM: { name: "Platinum", threshold: 10000 },
};
