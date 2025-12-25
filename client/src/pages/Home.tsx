import { Link } from "wouter";
import { ArrowRight, Trophy, Code2, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/hooks/use-user";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-24 lg:py-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 blur-[100px] rounded-full mix-blend-screen opacity-50" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[500px] bg-secondary/10 blur-[120px] rounded-full mix-blend-screen opacity-40" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-border/50 backdrop-blur-md border border-white/10 text-sm font-medium text-secondary mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              The Arena is Live
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-tight mb-8 drop-shadow-2xl">
              Prove Your Skills <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Build Your Legend
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
              Complete real-world engineering challenges. Earn XP. Rank up from Bronze to Platinum. 
              Join the elite community of developers proving their worth in the Arena.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={user ? "/arena" : "/api/login"}>
                <button className="px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 cursor-pointer">
                  {user ? "Enter the Arena" : "Join Now"} <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              {!user && (
                <Link href="/arena">
                  <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-colors backdrop-blur-sm cursor-pointer">
                    Explore Tasks
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-black/20 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Code2,
              title: "Real Tasks",
              desc: "From AI pipelines to Full-Stack features, tackle problems that matter.",
              color: "text-blue-400"
            },
            {
              icon: Trophy,
              title: "Earn Prestige",
              desc: "Climb the ranked ladder. Show off your Platinum badge to the world.",
              color: "text-yellow-400"
            },
            {
              icon: Rocket,
              title: "Career Velocity",
              desc: "Your profile acts as a verified portfolio of your technical capabilities.",
              color: "text-purple-400"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
            >
              <feature.icon className={`w-12 h-12 ${feature.color} mb-6`} />
              <h3 className="text-2xl font-display font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
