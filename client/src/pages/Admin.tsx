import { useState } from "react";
import { useCreateTask } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Plus, LayoutList } from "lucide-react";
import { motion } from "framer-motion";

export default function Admin() {
  const { user } = useAuth();
  const createTask = useCreateTask();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Full-Stack",
    difficulty: "Medium",
    points: 100,
    estimatedTime: "2 hours",
    tagsString: "",
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Restricted Access
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask.mutateAsync({
        ...formData,
        tags: formData.tagsString.split(',').map(t => t.trim()).filter(Boolean),
      });
      alert("Task Created!");
      setFormData({
        title: "",
        description: "",
        category: "Full-Stack",
        difficulty: "Medium",
        points: 100,
        estimatedTime: "2 hours",
        tagsString: "",
      });
    } catch (error) {
      alert("Error creating task");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-xl bg-primary/20 text-primary">
          <LayoutList className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white">Task Management</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Title</label>
              <input
                required
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-white focus:border-primary focus:ring-1 focus:ring-primary/50"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-white focus:border-primary focus:ring-1 focus:ring-primary/50"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Full-Stack</option>
                <option>AI/ML</option>
                <option>Data Science</option>
                <option>Cloud/DevOps</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Difficulty</label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-white focus:border-primary focus:ring-1 focus:ring-primary/50"
                value={formData.difficulty}
                onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Points</label>
              <input
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-white focus:border-primary focus:ring-1 focus:ring-primary/50"
                value={formData.points}
                onChange={e => setFormData({ ...formData, points: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Estimated Time</label>
              <input
                required
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-white focus:border-primary focus:ring-1 focus:ring-primary/50"
                value={formData.estimatedTime}
                onChange={e => setFormData({ ...formData, estimatedTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Tags (comma separated)</label>
              <input
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-white focus:border-primary focus:ring-1 focus:ring-primary/50"
                value={formData.tagsString}
                onChange={e => setFormData({ ...formData, tagsString: e.target.value })}
                placeholder="React, Node.js, API"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <textarea
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-white focus:border-primary focus:ring-1 focus:ring-primary/50"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={createTask.isPending}
            className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            {createTask.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
            Create Task
          </button>
        </form>
      </motion.div>
    </div>
  );
}
