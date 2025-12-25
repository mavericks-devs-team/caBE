import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { useSubmissions } from "@/hooks/use-submissions";
import { TaskCard } from "@/components/ui/TaskCard";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

export default function Arena() {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: submissions } = useSubmissions();
  
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const completedTaskIds = new Set(
    submissions?.filter(s => s.status === "approved").map(s => s.taskId) || []
  );

  const categories = Array.from(new Set(tasks?.map(t => t.category) || []));

  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                          task.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? task.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">The Arena</h1>
          <p className="text-muted-foreground">Select a challenge and prove your worth.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all whitespace-nowrap cursor-pointer
                ${!categoryFilter 
                  ? "bg-white text-black border-white" 
                  : "bg-transparent text-muted-foreground border-border hover:border-white/50"}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all whitespace-nowrap cursor-pointer
                  ${categoryFilter === cat 
                    ? "bg-secondary/20 text-secondary border-secondary" 
                    : "bg-transparent text-muted-foreground border-border hover:border-white/50"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tasksLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-card/50 border border-border animate-pulse" />
          ))}
        </div>
      ) : filteredTasks?.length === 0 ? (
        <div className="text-center py-20 bg-card/30 rounded-3xl border border-white/5">
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No tasks found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks?.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              isCompleted={completedTaskIds.has(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
