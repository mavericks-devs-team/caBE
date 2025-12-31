import { db } from "./firebase-admin.js";
import {
  RANKS,
  type Task,
  type InsertTask,
  type Submission,
  type InsertSubmission,
} from "@shared/models";
import {
  MOCK_TASKS,
  MOCK_USERS,
  MOCK_LEADERBOARD,
} from "./mockData.js";

export interface FirebaseStorage {
  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | null>;
  createTask(task: InsertTask): Promise<Task>;

  // Submissions
  createSubmission(submission: any): Promise<Submission>;
  getUserSubmissions(userId: string): Promise<any[]>;
  getUser(id: string): Promise<any>;
  updateUser(id: string, updates: any): Promise<void>;
  processSubmissionResult(
    userId: string,
    taskId: string,
    score: number,
    taskPoints: number
  ): Promise<{ rankUp: boolean; newRank: string; earnedPoints: number }>;

  // Read-Only Feeds
  getRecentSubmissions(userId: string, limit: number): Promise<any[]>;
  getLeaderboard(limit: number, afterPoints?: number): Promise<any[]>;
}

class FirestoreStorage implements FirebaseStorage {
  async getTasks(): Promise<Task[]> {
    console.log("⚠️ Using MOCK TASKS (Credentials missing or forced)");
    return MOCK_TASKS;
  }

  async getTask(id: string): Promise<Task | null> {
    return MOCK_TASKS.find((t) => t.id === id) || null;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const newTask = {
      ...task,
      id: `mock-${Date.now()}`,
      createdAt: new Date(),
    } as Task;

    MOCK_TASKS.push(newTask);
    return newTask;
  }

  async createSubmission(submission: any): Promise<Submission> {
    console.log("⚠️ Using MOCK SUBMISSION");

    return {
      id: `mock-submission-${Date.now()}`,
      ...submission,
      createdAt: new Date(),
    } as Submission;
  }

  async getUserSubmissions(_userId: string): Promise<any[]> {
    return [];
  }

  async getUser(id: string): Promise<any> {
    return { ...MOCK_USERS["default"], id };
  }

  async updateUser(id: string, updates: any): Promise<void> {
    console.log(`Mock Update User ${id}:`, updates);
  }

  async processSubmissionResult(
    _userId: string,
    _taskId: string,
    score: number,
    taskPoints: number
  ): Promise<{ rankUp: boolean; newRank: string; earnedPoints: number }> {
    const earnedPoints = Math.floor(taskPoints * (score / 100));
    return { rankUp: false, newRank: "Bronze", earnedPoints };
  }

  async getRecentSubmissions(_userId: string, _limit: number): Promise<any[]> {
    return [];
  }

  async getLeaderboard(_limit: number, _afterPoints?: number): Promise<any[]> {
    return MOCK_LEADERBOARD;
  }
}

export const storage = new FirestoreStorage();

/*
  ------------------------------------------------------------------
  Compatibility Helpers for routes.ts
  These functions map to the storage methods your backend already uses
  ------------------------------------------------------------------
*/

export async function getAllTasks(): Promise<Task[]> {
  return storage.getTasks();
}

export async function getTaskById(id: string): Promise<Task | null> {
  return storage.getTask(id);
}

export async function createTask(data: InsertTask): Promise<Task> {
  return storage.createTask(data);
}
