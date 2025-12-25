import { db } from "./db";
import {
  users, tasks, submissions,
  type User, type UpsertUser,
  type Task, type InsertTask,
  type Submission, type InsertSubmission,
  RANKS
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  // createUser(user: InsertUser): Promise<User>; // Handled by authStorage mostly, but useful
  updateUserPoints(id: string, points: number, rank: string): Promise<User>;

  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;

  // Submissions
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getUserSubmissions(userId: string): Promise<(Submission & { task: Task | null })[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  // async createUser(insertUser: InsertUser): Promise<User> {
  //   const [user] = await db.insert(users).values(insertUser).returning();
  //   return user;
  // }

  async updateUserPoints(id: string, points: number, rank: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ points, rank })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db.insert(submissions).values(submission).returning();
    return newSubmission;
  }

  async getUserSubmissions(userId: string): Promise<(Submission & { task: Task | null })[]> {
    const results = await db.query.submissions.findMany({
      where: eq(submissions.userId, userId),
      with: {
        task: true
      },
      orderBy: desc(submissions.createdAt)
    });
    return results;
  }
}

export const storage = new DatabaseStorage();
