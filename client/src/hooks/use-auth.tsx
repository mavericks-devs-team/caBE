import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut,
    GoogleAuthProvider
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

// Define our User type extending Firebase User (or replacing it with our schema)
// For now, we mix them or just use the Firestore data + auth uid
export type AppUser = {
    uid: string;
    email: string | null;
    username?: string;
    displayName?: string;
    photoURL?: string;
    rank?: string;
    points?: number;
    completedTasks?: Record<string, number>;
    role?: string; // 'user' | 'admin'
    isTrusted?: boolean;
};

type AuthContextType = {
    user: AppUser | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => { },
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
            if (timer) clearTimeout(timer); // Clear fallback timer if auth responds

            if (firebaseUser) {
                // User is signed in. Listen to their Firestore document.
                const userRef = doc(db, "users", firebaseUser.uid);

                const unsubDoc = onSnapshot(userRef, async (docSnap: any) => {
                    if (docSnap.exists()) {
                        // User exists in DB, sync state
                        const userData = docSnap.data();
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: userData.displayName || firebaseUser.displayName,
                            photoURL: userData.photoURL || firebaseUser.photoURL,
                            username: userData.username,
                            // Priority: Root level (updated by backend) -> gameData (initial structure) -> Default
                            rank: userData.rank || userData.gameData?.rank || "Bronze",
                            points: userData.points ?? userData.gameData?.points ?? 0,
                            completedTasks: userData.completedTasks || {},
                            role: userData.role || userData.gameData?.role || "user",
                            isTrusted: userData.security?.isTrusted || false
                        });
                    } else {
                        // User is authenticated but no doc in "users" collection yet.
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName || "",
                            photoURL: firebaseUser.photoURL || "",
                            rank: "Bronze",
                            points: 0,
                            role: "user"
                        });
                    }
                    setLoading(false);
                }, (error: any) => {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                });

                return () => unsubDoc();
            } else {
                // User is signed out.
                setUser(null);
                setLoading(false);
            }
        });

        // FALLBACK: If Firebase takes too long (e.g. 2s), use MOCK USER for Demo/MVP
        timer = setTimeout(() => {
            console.warn("⚠️ Auth slow/failed. Using MOCK USER for MVP.");
            setUser({
                uid: "mock-user-1",
                email: "demo@example.com",
                displayName: "Mock Agent",
                username: "GuestAgent",
                photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
                rank: "Silver",
                points: 1250,
                role: "user",
                completedTasks: { "mock-3": 100 }
            });
            setLoading(false);
        }, 2000);

        return () => {
            unsubscribe();
            if (timer) clearTimeout(timer);
        };
    }, []);

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // Logic for new user creation in Firestore could go here 
            // if we don't rely entirely on Triggers.
            // For now, we let the onAuthStateChanged listener handle the sync.

            // OPTIONAL: Check if first time login and create doc immediately if preferred
            // to avoid "flicker" of empty state.
            const userRef = doc(db, "users", result.user.uid);
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
                await setDoc(userRef, {
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                    metadata: {
                        createdAt: new Date(),
                        lastLoginAt: new Date(),
                        emailVerified: result.user.emailVerified
                    },
                    gameData: {
                        rank: "Bronze",
                        points: 0,
                        role: "user",
                        badges: []
                    },
                    security: {
                        isTrusted: false,
                        isBanned: false
                    }
                });
                toast({ title: "Welcome to CaBE Arena!" });
            } else {
                toast({ title: "Welcome back!" });
            }

        } catch (error: any) {
            console.error("Login failed:", error);
            toast({
                title: "Login Failed",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            toast({ title: "Signed out successfully" });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
            {!loading && children}
            {/* 
        Ideally we show a generic loader while checking auth state 
        to prevent redirects for logged-in users.
        For now: render nothing until loading is done. 
      */}
            {loading && (
                <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <p className="text-muted-foreground animate-pulse">Initializing Arena...</p>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
