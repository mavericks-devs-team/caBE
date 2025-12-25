import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import Auth & Chat models
export * from "./models/auth";
export * from "./models/chat";

// We need to import 'users' from models/auth to use in relations
import { users } from "./models/auth";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // AI/ML, Cloud/DevOps, Data Science, Full-Stack
  difficulty: text("difficulty").notNull(), // Easy, Medium, Hard
  points: integer("points").notNull(),
  estimatedTime: text("estimated_time").notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Changed to text to match users.id (varchar)
  taskId: integer("task_id").notNull(),
  proofContent: text("proof_content").notNull(),
  status: text("status").default("pending").notNull(),
  score: integer("score").default(0),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const tasksRelations = relations(tasks, ({ many }) => ({
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [submissions.taskId],
    references: [tasks.id],
  }),
}));

// Schemas
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true, createdAt: true, status: true, score: true, feedback: true });

// Types
export type Task = typeof tasks.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;

export const RANKS = {
  BRONZE: { name: "Bronze", threshold: 0 },
  SILVER: { name: "Silver", threshold: 1000 },
  GOLD: { name: "Gold", threshold: 5000 },
  PLATINUM: { name: "Platinum", threshold: 10000 },
};
