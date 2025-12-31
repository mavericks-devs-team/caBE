import { Task, User } from "@shared/models";

export const MOCK_TASKS: Task[] = [
    {
        id: "mock-1",
        title: "Build a Simple Image Classifier",
        description: "Create a neural network using TensorFlow/PyTorch to classify images from the CIFAR-10 dataset.",
        category: "AI/ML",
        difficulty: "Medium",
        points: 400,
        estimatedTime: "2 hours",
        tags: ["neural-networks", "computer-vision"]
    },
    {
        id: "mock-2",
        title: "Deploy a Containerized Microservice",
        description: "Dockerize a simple Node.js app and deploy it to a Kubernetes cluster (or simulated env).",
        category: "Cloud/DevOps",
        difficulty: "Hard",
        points: 600,
        estimatedTime: "3 hours",
        tags: ["kubernetes", "docker", "devops"]
    },
    {
        id: "mock-3",
        title: "Analyze Sales Data",
        description: "Clean and analyze a provided CSV dataset of sales records. Produce 3 key insights.",
        category: "Data Science",
        difficulty: "Easy",
        points: 250,
        estimatedTime: "1 hour",
        tags: ["pandas", "data-analysis"]
    },
    {
        id: "mock-4",
        title: "Refactor Legacy Auth",
        description: "Convert a callback-based authentication middleware to use Async/Await and improved error handling.",
        category: "Backend",
        difficulty: "Hard",
        points: 500,
        estimatedTime: "2.5 hours",
        tags: ["refactoring", "nodejs", "async"]
    },
    {
        id: "mock-5",
        title: "Implement Rate Limiter",
        description: "Create a sliding window rate limiter for an Express.js API using Redis or in-memory storage.",
        category: "Backend",
        difficulty: "Medium",
        points: 350,
        estimatedTime: "1.5 hours",
        tags: ["algorithms", "performance"]
    },
    {
        id: "mock-6",
        title: "Flexbox Dashboard Layout",
        description: "Recreate a provided dashboard wireframe using only CSS Flexbox. Ensure mobile responsiveness.",
        category: "Frontend",
        difficulty: "Easy",
        points: 200,
        estimatedTime: "45 mins",
        tags: ["css", "responsive-design"]
    }
];

export const MOCK_USERS: Record<string, User> = {
    "default": {
        id: "mock-user-1",
        username: "Demo User",
        email: "demo@example.com",
        points: 1200,
        rank: "Silver",
        completedTasks: { "mock-3": 100 },
        role: "user"
    }
};

export const MOCK_LEADERBOARD = [
    { id: "u1", username: "CodeMaster", points: 5000, rank: "Gold", profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
    { id: "u2", username: "DevOpsNinja", points: 3400, rank: "Silver", profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" },
    { id: "u3", username: "DataWizard", points: 1200, rank: "Silver", profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
    { id: "u4", username: "NewbieDev", points: 100, rank: "Bronze", profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mittens" },
    { id: "u5", username: "AlgorithmAce", points: 4500, rank: "Gold", profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    { id: "u6", username: "FullStackHero", points: 2800, rank: "Silver", profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { id: "u7", username: "BugHunter", points: 900, rank: "Bronze", profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
    { id: "u8", username: "PixelPerfect", points: 3100, rank: "Silver", profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" },
    { id: "u9", username: "RustEvangelist", points: 5200, rank: "Gold", profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
];
