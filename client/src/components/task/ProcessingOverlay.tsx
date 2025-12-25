import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Loader2, Terminal, Code2, Cpu } from "lucide-react";

const STEPS = [
    { text: "Verifying Repository Integrity...", icon: Terminal },
    { text: "Analyzing Code Structure...", icon: Code2 },
    { text: "Calculating Efficiency Metrics...", icon: Cpu },
    { text: "Finalizing Score...", icon: Loader2 },
];

export function ProcessingOverlay() {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
        }, 800);
        return () => clearInterval(interval);
    }, []);

    const StepIcon = STEPS[currentStep].icon;

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            {/* Visual Scanning Effect */}
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                {/* Pulsing Rings */}
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 border border-primary/30 rounded-full"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: "easeOut",
                        }}
                    />
                ))}

                {/* Center Icon with Glow */}
                <motion.div
                    key={currentStep}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 p-4 bg-primary/10 rounded-xl border border-primary/20 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                >
                    <StepIcon className="w-8 h-8 text-primary" />
                </motion.div>
            </div>

            {/* Status Text */}
            <div className="h-8 relative w-full text-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm font-mono text-primary/80 uppercase tracking-widest absolute inset-x-0"
                    >
                        {STEPS[currentStep].text}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-white/5 rounded-full mt-8 overflow-hidden">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.5, ease: "linear" }}
                />
            </div>
        </div>
    );
}
