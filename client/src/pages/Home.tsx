import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { MaterialIcon } from "@/components/MaterialIcon";

export default function Home() {
  const { user, signInWithGoogle } = useAuth();

  return (
    <div className="bg-background-dark font-display text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 py-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]"></div>
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M0 0h1v1H0zM19 0h1v1h-1zM0 19h1v1H0zM19 19h1v1h-1z' fill='%23fff'/%3E%3C/svg%3E')" }}></div>
        </div>

        <div className="relative z-10 container max-w-5xl mx-auto text-center flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-xs font-medium uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Season 4 is Live
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white">
            YOUR SKILLS.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">VERIFIED.</span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-slate-400 font-light leading-relaxed">
            Stop sending resumes. Start showing proof. Enter the Arena where rank is earned through code, not claimed on PDF.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
            {user ? (
              <Link href="/arena">
                <button className="flex items-center justify-center gap-2 h-14 px-8 bg-primary hover:bg-blue-600 text-white text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,71,244,0.3)]">
                  <MaterialIcon icon="swords" />
                  Enter the Arena
                </button>
              </Link>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center justify-center gap-2 h-14 px-8 bg-primary hover:bg-blue-600 text-white text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,71,244,0.3)]"
              >
                <MaterialIcon icon="swords" />
                Start Your Climb
              </button>
            )}
            <Link href="/arena">
              <button className="flex items-center justify-center gap-2 h-14 px-8 bg-slate-800 hover:bg-slate-700 text-white text-lg font-medium rounded-lg border border-slate-700 transition-colors">
                Explore Ranks
              </button>
            </Link>
          </div>

          {/* Hero Image / Visual */}
          <div className="mt-16 w-full max-w-4xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl opacity-30 blur group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-full aspect-[16/9] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
              <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>

              {/* Floating UI Element simulation */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between p-4 bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-300 flex items-center justify-center shadow-lg">
                    <MaterialIcon icon="military_tech" className="text-black font-bold" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Rank Up: Gold Tier</h3>
                    <p className="text-slate-400 text-xs">Unlocked by completing "Distributed Systems II"</p>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-primary font-bold text-xl">Top 5%</p>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">Global Ranking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker Section */}
      <div className="w-full bg-background-darker border-y border-slate-800 overflow-hidden py-3">
        <div className="container mx-auto max-w-[1280px] px-4 flex items-center gap-6">
          <span className="flex items-center gap-1 text-green-500 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
            <MaterialIcon icon="circle" className="text-sm" /> Live Arena Feed
          </span>
          <div className="flex-1 overflow-hidden relative">
            <p className="text-slate-400 text-sm font-mono whitespace-nowrap flex gap-12 animate-scroll">
              <span className="flex items-center gap-2"><span className="text-white font-bold">Alex K.</span> reached <span className="text-yellow-400">Gold Tier</span></span>
              <span className="flex items-center gap-2"><span className="text-white font-bold">Sarah M.</span> just deployed <span className="text-primary">Node.js Challenge</span></span>
              <span className="flex items-center gap-2"><span className="text-white font-bold">Marcus R.</span> unlocked <span className="text-cyan-400">Platinum Status</span></span>
              <span className="flex items-center gap-2"><span className="text-white font-bold">DevTeam_One</span> is hiring <span className="text-primary">Silver+</span></span>
              <span className="flex items-center gap-2 opacity-50"><span className="text-white font-bold">Elena D.</span> started <span className="text-orange-400">Bronze Trials</span></span>
            </p>
            <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-background-darker to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Value Proposition (Proof > Potential) */}
      <section className="py-24 px-4 bg-background-dark">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">PROOF &gt; POTENTIAL</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Traditional resumes are static claims. CaBE Arena profiles are dynamic proof of work.
              Employers don't want to read about what you *can* do. They want to see what you *have* done.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* The Old Way */}
            <div className="group relative rounded-2xl bg-card-bg border border-slate-800 p-8 overflow-hidden transition-opacity duration-300 hover:opacity-100 opacity-60">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-700"></div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-300">The Old Way</h3>
                <MaterialIcon icon="description" className="text-slate-500 text-3xl" />
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                <div className="h-32 bg-slate-800/50 rounded-lg p-4 border border-dashed border-slate-700 flex flex-col items-center justify-center text-center gap-2">
                  <MaterialIcon icon="warning" className="text-slate-600 text-4xl" />
                  <p className="text-slate-500 text-sm">Unverified Claims</p>
                </div>
                <p className="text-slate-500 text-sm mt-4">"Proficient in React" — Says who?</p>
              </div>
            </div>

            {/* The Arena Way */}
            <div className="group relative rounded-2xl bg-card-bg-alt border border-primary/30 p-8 overflow-hidden shadow-2xl shadow-primary/5">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  The Arena Way
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white uppercase tracking-wide">Verified</span>
                </h3>
                <MaterialIcon icon="verified_user" className="text-primary text-3xl" />
              </div>
              {/* Visualization of verified skills */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-slate-300 mb-1">
                  <span>React Architecture</span>
                  <span className="text-primary font-bold">Top 2%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
                  <div className="bg-primary h-2 rounded-full w-[98%] shadow-[0_0_10px_#2547f4]"></div>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-300 mb-1">
                  <span>System Design</span>
                  <span className="text-green-400 font-bold">Passed</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-full"></div>
                </div>
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-3">
                  <MaterialIcon icon="code" className="text-primary mt-1" />
                  <div>
                    <p className="text-white text-sm font-bold">Live Code Challenges</p>
                    <p className="text-slate-400 text-xs">Real-time rank progression based on actual output.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Climb (Rank Visualization) */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background decorative line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent transform -translate-x-1/2 hidden md:block"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">THE LADDER</h2>
            <p className="text-slate-400">Earn your place. Every rank unlocks new opportunities.</p>
          </div>

          <div className="flex flex-col gap-12">
            {/* Bronze */}
            <div className="flex flex-col md:flex-row items-center gap-8 group">
              <div className="order-2 md:order-1 flex-1 text-center md:text-right">
                <h3 className="text-2xl font-bold text-orange-400">Bronze Tier</h3>
                <p className="text-slate-400 mt-2">Prove the basics. Complete syntax challenges and basic algorithm tests.</p>
              </div>
              <div className="order-1 md:order-2 flex-shrink-0 relative">
                <div className="w-20 h-20 rounded-xl bg-card-bg-alt border-2 border-orange-900 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(251,146,60,0.1)]">
                  <MaterialIcon icon="military_tech" className="text-4xl text-orange-500" />
                </div>
              </div>
              <div className="order-3 flex-1 hidden md:block"></div>
            </div>

            {/* Silver */}
            <div className="flex flex-col md:flex-row items-center gap-8 group">
              <div className="order-3 md:order-1 flex-1 hidden md:block"></div>
              <div className="order-1 md:order-2 flex-shrink-0 relative">
                <div className="w-20 h-20 rounded-xl bg-card-bg-alt border-2 border-slate-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(148,163,184,0.1)]">
                  <MaterialIcon icon="military_tech" className="text-4xl text-slate-300" />
                </div>
              </div>
              <div className="order-2 md:order-3 flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-300">Silver Tier</h3>
                <p className="text-slate-400 mt-2">Intermediate mastery. Build functional components and solve database queries.</p>
              </div>
            </div>

            {/* Gold */}
            <div className="flex flex-col md:flex-row items-center gap-8 group">
              <div className="order-2 md:order-1 flex-1 text-center md:text-right">
                <h3 className="text-2xl font-bold text-yellow-400">Gold Tier</h3>
                <p className="text-slate-400 mt-2">Advanced engineering. System design, optimization, and complex integrations.</p>
              </div>
              <div className="order-1 md:order-2 flex-shrink-0 relative">
                <div className="w-20 h-20 rounded-xl bg-card-bg-alt border-2 border-yellow-700 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-[0_0_25px_rgba(250,204,21,0.2)]">
                  <MaterialIcon icon="military_tech" className="text-4xl text-yellow-400" />
                </div>
              </div>
              <div className="order-3 flex-1 hidden md:block"></div>
            </div>

            {/* Platinum */}
            <div className="flex flex-col md:flex-row items-center gap-8 group">
              <div className="order-3 md:order-1 flex-1 hidden md:block"></div>
              <div className="order-1 md:order-2 flex-shrink-0 relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 blur-lg group-hover:opacity-40 transition-opacity"></div>
                <div className="w-24 h-24 rounded-xl bg-card-bg-alt border-2 border-cyan-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 relative z-10 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                  <MaterialIcon icon="trophy" className="text-5xl text-cyan-400" />
                </div>
              </div>
              <div className="order-2 md:order-3 flex-1 text-center md:text-left">
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Platinum Status</h3>
                <p className="text-slate-300 mt-2 text-lg">Elite Verification. Full-stack mastery, architectural leadership. Access exclusive opportunities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background-darker border-y border-border-darker">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-card-bg-lighter border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="size-12 rounded-lg bg-slate-800 flex items-center justify-center mb-4">
                <MaterialIcon icon="visibility" className="text-white" />
              </div>
              <h4 className="text-white text-lg font-bold mb-2">Total Visibility</h4>
              <p className="text-slate-400 text-sm">See exactly where you stand compared to global talent pools with real-time analytics.</p>
            </div>
            <div className="p-6 rounded-xl bg-card-bg-lighter border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="size-12 rounded-lg bg-slate-800 flex items-center justify-center mb-4">
                <MaterialIcon icon="business_center" className="text-white" />
              </div>
              <h4 className="text-white text-lg font-bold mb-2">Direct Hiring</h4>
              <p className="text-slate-400 text-sm">Companies filter by rank. Gold and Platinum members get interview offers directly.</p>
            </div>
            <div className="p-6 rounded-xl bg-card-bg-lighter border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="size-12 rounded-lg bg-slate-800 flex items-center justify-center mb-4">
                <MaterialIcon icon="lock" className="text-white" />
              </div>
              <h4 className="text-white text-lg font-bold mb-2">Cheat-Proof</h4>
              <p className="text-slate-400 text-sm">Our proctoring AI ensures that every line of code written in the Arena is yours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5">
          <div className="absolute inset-0 opacity-[0.05] bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 0h1v1H0zM39 0h1v1h-1zM0 39h1v1H0zM39 39h1v1h-1z' fill='%23fff'/%3E%3C/svg%3E')" }}></div>
        </div>
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">READY TO ENTER?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-xl mx-auto">
            Join 50,000+ developers proving their worth. The climb is hard, but the view from Platinum is worth it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/dashboard">
                <button className="h-14 px-10 bg-primary hover:bg-blue-600 text-white text-lg font-bold rounded-lg shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-1">
                  Go to Dashboard
                </button>
              </Link>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="h-14 px-10 bg-primary hover:bg-blue-600 text-white text-lg font-bold rounded-lg shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-1"
              >
                Create Free Account
              </button>
            )}
            <Link href="/arena">
              <button className="h-14 px-10 bg-transparent hover:bg-white/5 text-white text-lg font-medium rounded-lg border border-slate-600 transition-colors">
                View Demo Profile
              </button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500">No credit card required. Start at Bronze today.</p>
        </div>
      </section>
    </div>
  );
}
