import { motion } from 'framer-motion';
import HeroScene from './HeroScene';
import HeroChat from './HeroChat';

export default function Hero() {
    return (
        <section
            id="hero"
            className="relative h-screen flex flex-col items-center justify-start pt-16 pb-4 overflow-hidden"
        >
            {/* 3D Background — sits behind everything */}
            <HeroScene />

            {/* Gradient overlays for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-surface-50/80 via-surface-50/40 to-surface-50 dark:from-surface-950/80 dark:via-surface-950/40 dark:to-surface-950 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-3xl mx-auto px-4 flex flex-col items-center">
                {/* Status badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-3"
                >
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-xs font-mono font-medium text-accent dark:text-accent-light">
                        Available for opportunities
                    </span>
                </motion.div>

                {/* Greeting */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-base sm:text-lg text-surface-900/60 dark:text-surface-200/60 font-body mb-1"
                >
                    Hey, I'm Aman Paswan 👋
                </motion.p>

                {/* Big title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-4 text-center"
                >
                    <span className="heading-gradient">Backend Dev</span>
                    <span className="text-surface-900 dark:text-white"> & </span>
                    <span className="heading-gradient">GenAI Engineer</span>
                </motion.h1>

                {/* 3D model avatar — compact */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 mb-4 pointer-events-none"
                >
                    {/* Glow ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/30 to-primary-500/30 blur-xl animate-glow-pulse" />
                    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-accent/10 to-primary-500/10 backdrop-blur-sm border border-accent/20 dark:border-accent/10" />

                    {/* 3D-style animated hexagon brain icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-accent to-primary-600 flex items-center justify-center shadow-2xl shadow-accent/40 animate-float relative overflow-hidden">
                            {/* Shimmer layer */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                            {/* Neural network / AI brain icon */}
                            <svg className="w-9 h-9 sm:w-10 sm:h-10 text-white relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                {/* Central node */}
                                <circle cx="12" cy="12" r="2" fill="currentColor" strokeWidth="0" />
                                {/* Outer nodes */}
                                <circle cx="5" cy="6" r="1.5" fill="currentColor" strokeWidth="0" opacity="0.9" />
                                <circle cx="19" cy="6" r="1.5" fill="currentColor" strokeWidth="0" opacity="0.9" />
                                <circle cx="5" cy="18" r="1.5" fill="currentColor" strokeWidth="0" opacity="0.9" />
                                <circle cx="19" cy="18" r="1.5" fill="currentColor" strokeWidth="0" opacity="0.9" />
                                <circle cx="12" cy="3" r="1.5" fill="currentColor" strokeWidth="0" opacity="0.8" />
                                <circle cx="12" cy="21" r="1.5" fill="currentColor" strokeWidth="0" opacity="0.8" />
                                {/* Connections */}
                                <line x1="12" y1="12" x2="5" y2="6" strokeWidth="1" opacity="0.7" />
                                <line x1="12" y1="12" x2="19" y2="6" strokeWidth="1" opacity="0.7" />
                                <line x1="12" y1="12" x2="5" y2="18" strokeWidth="1" opacity="0.7" />
                                <line x1="12" y1="12" x2="19" y2="18" strokeWidth="1" opacity="0.7" />
                                <line x1="12" y1="12" x2="12" y2="3" strokeWidth="1" opacity="0.7" />
                                <line x1="12" y1="12" x2="12" y2="21" strokeWidth="1" opacity="0.7" />
                                {/* Cross connections */}
                                <line x1="5" y1="6" x2="12" y2="3" strokeWidth="0.8" opacity="0.4" />
                                <line x1="19" y1="6" x2="12" y2="3" strokeWidth="0.8" opacity="0.4" />
                                <line x1="5" y1="18" x2="12" y2="21" strokeWidth="0.8" opacity="0.4" />
                                <line x1="19" y1="18" x2="12" y2="21" strokeWidth="0.8" opacity="0.4" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                {/* Chat card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                >
                    <HeroChat />
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-6 h-10 rounded-full border-2 border-surface-900/15 dark:border-surface-200/15 flex justify-center pt-2"
                >
                    <div className="w-1 h-2 rounded-full bg-accent/60" />
                </motion.div>
            </motion.div>
        </section>
    );
}
