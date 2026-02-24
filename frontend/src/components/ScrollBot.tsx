import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import ChatWidget from './ChatWidget';

const SECTION_HINTS: Record<string, string> = {
    about: '🎓 Curious about my background?',
    skills: '💻 Ask about my tech stack!',
    experience: '💼 Want details on my work?',
    projects: '🚀 Ask about any project!',
    contact: "📬 Let's connect!",
};

export default function ScrollBot() {
    const [chatOpen, setChatOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState('hero');
    const [showHint, setShowHint] = useState(false);
    const [heroVisible, setHeroVisible] = useState(true);
    const { scrollY } = useScroll();

    // Track if we're past the hero section
    useMotionValueEvent(scrollY, 'change', (latest) => {
        // Hero is ~100vh tall. Show button after scrolling ~70% of viewport
        const threshold = window.innerHeight * 0.7;
        setHeroVisible(latest < threshold);
    });

    // Smooth opacity/scale for the floating bot entrance
    const botOpacity = useTransform(
        scrollY,
        [window.innerHeight * 0.5, window.innerHeight * 0.9],
        [0, 1]
    );
    const botScale = useTransform(
        scrollY,
        [window.innerHeight * 0.5, window.innerHeight * 0.9],
        [0.3, 1]
    );
    // The bot "flies in" from center — translate from center of screen to bottom-right
    const botX = useTransform(
        scrollY,
        [window.innerHeight * 0.5, window.innerHeight * 0.9],
        ['-40vw', '0vw']
    );
    const botY = useTransform(
        scrollY,
        [window.innerHeight * 0.5, window.innerHeight * 0.9],
        ['-40vh', '0vh']
    );

    // Detect current section for contextual hints
    useEffect(() => {
        const sectionIds = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setCurrentSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.3 }
        );

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Show contextual hint periodically (only when bot is visible and chat is closed)
    useEffect(() => {
        if (chatOpen || heroVisible) {
            setShowHint(false);
            return;
        }

        // Initial hint after arriving at a new section
        const initialTimeout = setTimeout(() => {
            setShowHint(true);
            setTimeout(() => setShowHint(false), 3500);
        }, 2000);

        const interval = setInterval(() => {
            setShowHint(true);
            setTimeout(() => setShowHint(false), 3500);
        }, 10000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, [chatOpen, heroVisible, currentSection]);

    return (
        <>
            <ChatWidget isOpen={chatOpen && !heroVisible} onClose={() => setChatOpen(false)} />

            {/* Floating bot — only shows after scrolling past hero */}
            <motion.div
                style={{
                    opacity: botOpacity,
                    scale: botScale,
                    x: botX,
                    y: botY,
                }}
                className={`fixed bottom-6 right-6 z-50 ${heroVisible ? 'pointer-events-none' : ''}`}
            >
                {/* Contextual hint bubble */}
                <AnimatePresence>
                    {showHint && !chatOpen && !heroVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            className="absolute bottom-full right-0 mb-3 px-4 py-2.5 rounded-xl rounded-br-sm bg-white dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/50 shadow-xl whitespace-nowrap"
                        >
                            <span className="text-sm text-surface-900 dark:text-surface-200">
                                {SECTION_HINTS[currentSection] || '💬 Chat with me!'}
                            </span>
                            <div className="absolute -bottom-1.5 right-5 w-3 h-3 rotate-45 bg-white dark:bg-surface-900 border-r border-b border-surface-200/50 dark:border-surface-800/50" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bot button */}
                <motion.button
                    onClick={() => {
                        setChatOpen(!chatOpen);
                        setShowHint(false);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${chatOpen
                            ? 'bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-surface-200'
                            : 'bg-gradient-to-br from-accent to-primary-600 text-white shadow-accent/30'
                        }`}
                >
                    {/* Pulse ring when not opened */}
                    {!chatOpen && !heroVisible && (
                        <span className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
                    )}

                    <AnimatePresence mode="wait">
                        {chatOpen ? (
                            <motion.svg
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </motion.svg>
                        ) : (
                            <motion.svg
                                key="chat"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                className="w-6 h-6 relative z-10"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </motion.svg>
                        )}
                    </AnimatePresence>
                </motion.button>
            </motion.div>
        </>
    );
}
