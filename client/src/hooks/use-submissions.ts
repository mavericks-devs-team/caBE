import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateSubmissionRequest } from "@shared/routes";

// GET /api/submissions (User history)
export function useSubmissions() {
  return useQuery({
    queryKey: [api.submissions.list.path],
    queryFn: async () => {
      const res = await fetch(api.submissions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch submissions");
      return api.submissions.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/submissions
export function useCreateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSubmissionRequest) => {
      const validated = api.submissions.create.input.parse(data);
      const res = await fetch(api.submissions.create.path, {
        method: api.submissions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.submissions.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit task");
      }
      return api.submissions.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      // Invalidate both user (for points/rank) and history
      queryClient.invalidateQueries({ queryKey: [api.submissions.list.path] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });
}
