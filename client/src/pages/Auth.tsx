import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Link } from "wouter";

export default function Auth() {
    const [, setLocation] = useLocation();
    const { signInWithGoogle, loading } = useAuth();
    const [isSignIn, setIsSignIn] = useState(true);

    const handleGoogleSignIn = async () => {
        await signInWithGoogle();
        setLocation("/arena");
    };

    return (
        <div className="flex min-h-screen w-full bg-background-dark">
            {/* Left Column: Authentication Form */}
            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-[45%] lg:px-20 xl:px-24 relative z-10 bg-background-dark border-r border-slate-800/50 shadow-2xl">

                {/* Logo Header */}
                <Link href="/">
                    <div className="absolute top-8 left-6 lg:left-12 flex items-center gap-3 text-white cursor-pointer hover:opacity-80 transition-opacity">
                        <img src="/cabe-logo.png" alt="CaBE" className="h-8 w-auto" />
                        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">Arena</h2>
                    </div>
                </Link>

                <div className="mx-auto w-full max-w-sm lg:w-[420px]">
                    {/* Headline */}
                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3">Enter the Arena</h1>
                        <p className="text-slate-400 text-base leading-relaxed">
                            Prove your skills. Skip the resume. Join 10,000+ developers claiming their rank.
                        </p>
                    </div>

                    {/* Google Sign-In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 rounded-lg bg-white hover:bg-gray-50 px-6 py-4 text-base font-medium text-gray-700 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                        </svg>
                        {loading ? "Signing in..." : "Continue with Google"}
                    </button>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        By signing in, you agree to our{" "}
                        <a href="#" className="text-primary hover:text-primary/80 transition-colors">Terms of Service</a>
                        {" "}and{" "}
                        <a href="#" className="text-primary hover:text-primary/80 transition-colors">Privacy Policy</a>
                    </p>
                </div>

                {/* Footer links */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 text-xs text-slate-500">
                    <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                    <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                    <a className="hover:text-primary transition-colors" href="#">Help Center</a>
                </div>
            </div>

            {/* Right Column: Visual Hero */}
            <div className="relative hidden w-0 flex-1 lg:block bg-[#0a0c16]">
                {/* Background Image */}
                <div className="absolute inset-0 h-full w-full bg-cover bg-center opacity-60 mix-blend-screen" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=800&fit=crop')" }}></div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>

                {/* Hero Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-20 z-10 pb-32">
                    {/* Floating Card Element simulating rank */}
                    <div className="mb-10 w-fit animate-pulse">
                        <div className="flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 backdrop-blur-md">
                            <span className="flex size-2 rounded-full bg-primary shadow-[0_0_10px_#2547f4]"></span>
                            <span className="text-sm font-bold text-primary tracking-wider uppercase">Next Rank: Platinum</span>
                        </div>
                    </div>

                    <blockquote className="border-l-4 border-primary pl-6">
                        <p className="text-2xl font-bold leading-relaxed text-white">
                            "The fastest way to prove your worth isn't on a piece of paper. It's in the arena."
                        </p>
                        <footer className="mt-4">
                            <div className="text-base font-semibold text-white">Alex Chen</div>
                            <div className="text-sm text-slate-400">Sr. Backend Engineer, Platinum Rank</div>
                        </footer>
                    </blockquote>

                    {/* Gamification decorative elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-primary/20 bg-primary/5 blur-3xl pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
}
