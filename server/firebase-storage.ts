import { db } from './firebase-admin';
import type { Task, InsertTask, Submission, InsertSubmission } from '@shared/schema';

export interface FirebaseStorage {
    // Tasks
    getTasks(): Promise<Task[]>;
    getTask(id: string): Promise<Task | null>;
    createTask(task: InsertTask): Promise<Task>;

    // Submissions
    createSubmission(submission: any): Promise<Submission>;
    getUserSubmissions(userId: string): Promise<any[]>;
}

class FirestoreStorage implements FirebaseStorage {
    async getTasks(): Promise<Task[]> {
        const snapshot = await db.collection('tasks').get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as any;
    }

    async getTask(id: string): Promise<Task | null> {
        const doc = await db.collection('tasks').doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as any;
    }

    async createTask(task: InsertTask): Promise<Task> {
        const docRef = await db.collection('tasks').add({
            ...task,
            createdAt: new Date(),
            isActive: true,
            stats: {
                totalSubmissions: 0,
                completionRate: 0
            }
        });

        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() } as any;
    }

    async createSubmission(submission: any): Promise<Submission> {
        const docRef = await db.collection('submissions').add({
            ...submission,
            createdAt: new Date()
        });

        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() } as any;
    }

    async getUserSubmissions(userId: string): Promise<any[]> {
        const snapshot = await db.collection('submissions')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        const submissions = [];
        for (const doc of snapshot.docs) {
            const data = doc.data();
            // Optionally fetch task details
            let task = null;
            if (data.taskId) {
                const taskDoc = await db.collection('tasks').doc(data.taskId).get();
                if (taskDoc.exists) {
                    task = { id: taskDoc.id, ...taskDoc.data() };
                }
            }

            submissions.push({
                id: doc.id,
                ...data,
                task
            });
        }

        return submissions as any;
    }
}

export const firebaseStorage = new FirestoreStorage();
