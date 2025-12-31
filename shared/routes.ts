import { z } from 'zod';
import { insertTaskSchema, insertSubmissionSchema, type Task, type Submission, type User } from './models';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  users: {
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<User>(),
        401: errorSchemas.notFound, // Not logged in
      },
    },
  },
  tasks: {
    list: {
      method: 'GET' as const,
      path: '/api/tasks',
      responses: {
        200: z.array(z.custom<Task>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/tasks/:id',
      responses: {
        200: z.custom<Task>(),
        404: errorSchemas.notFound,
      },
    },
    create: { // Admin only in theory, but open for MVP seeding
      method: 'POST' as const,
      path: '/api/tasks',
      input: insertTaskSchema,
      responses: {
        201: z.custom<Task>(),
        400: errorSchemas.validation,
      },
    },
  },
  submissions: {
    create: {
      method: 'POST' as const,
      path: '/api/submissions',
      input: insertSubmissionSchema,
      responses: {
        201: z.custom<Submission & { rankUp?: boolean; newRank?: string }>(),
        400: errorSchemas.validation,
      },
    },
    list: { // For user profile
      method: 'GET' as const,
      path: '/api/submissions',
      responses: {
        200: z.array(z.custom<Submission & { task?: Task }>()),
      },
    },
  },
};

export type CreateTaskRequest = z.infer<typeof insertTaskSchema>;
export type CreateSubmissionRequest = z.infer<typeof insertSubmissionSchema>;


export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
