import { motion } from 'framer-motion';
import RevealOnScroll from './RevealOnScroll';

const PROJECTS = [
    {
        title: 'Voice RAG Agent',
        tagline: 'Real-time voice-powered retrieval system',
        description:
            'Engineered a real-time Voice RAG system achieving 450ms TTFB via bi-directional SSE audio streaming. Implemented hybrid FAISS + BM25 + Cross-Encoder retrieval and a dual-LLM fallback architecture (Llama 3 → Gemini) with browser-based TTS eliminating 3s+ audio delay.',
        tech: ['FastAPI', 'FAISS', 'BM25', 'Llama 3', 'React 19', 'SSE'],
        metrics: ['450ms TTFB', '3s+ latency eliminated', 'Hybrid retrieval'],
        github: 'https://github.com/aman0603/voice-agent-Articence',
        accent: 'from-cyan-400 to-blue-500',
    },
    {
        title: 'DengueScope',
        tagline: 'AI-powered disease outbreak forecasting',
        description:
            'Developed an AI system forecasting dengue outbreaks across 20+ Brazilian cities using 15 years of epidemiological and climatic data. Applied PCA/PLS feature reduction and benchmarked CatBoost, LSTM, TCN, and TFT models achieving 85–90% accuracy.',
        tech: ['Python', 'Scikit-learn', 'TensorFlow', 'Google Trends'],
        metrics: ['85–90% accuracy', '20+ cities', '1–3 month early warnings'],
        github: 'https://github.com/aman0603/projj',
        accent: 'from-green-400 to-emerald-500',
    },
    {
        title: 'ConvoSphere',
        tagline: 'OSINT-enhanced sales intelligence assistant',
        description:
            'Engineered an outbound sales intelligence assistant combining OSINT enrichment with local LLM (Ollama) insights and Google Gemini coaching. Designed a multi-stage workflow for validated lead intelligence with real-time Telegram integration and WebSocket dashboards.',
        tech: ['React.js', 'FastAPI', 'MongoDB', 'Redis', 'Ollama', 'Gemini'],
        metrics: ['Multi-stage OSINT', 'Real-time streaming', 'LLM coaching'],
        github: 'https://github.com/aman0603/ConvoSphere',
        accent: 'from-violet-400 to-purple-500',
    },
];

export default function Projects() {
    return (
        <section id="projects" className="py-24">
            <div className="section-container">
                <RevealOnScroll>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px flex-1 max-w-[60px] bg-accent/50" />
                        <span className="text-accent font-mono text-sm">04</span>
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-surface-900 dark:text-white">
                        Featured <span className="heading-gradient">Projects</span>
                    </h2>
                    <p className="text-surface-900/50 dark:text-surface-200/50 max-w-xl mb-12">
                        A selection of AI-focused projects showcasing my approach to building intelligent systems.
                    </p>
                </RevealOnScroll>

                <div className="space-y-8">
                    {PROJECTS.map((project, i) => (
                        <RevealOnScroll key={project.title} delay={i * 0.1}>
                            <motion.div
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.3 }}
                                className="glass-card overflow-hidden group"
                            >
                                <div className="p-6 sm:p-8">
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                        {/* Left: content */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-display font-bold text-xl text-surface-900 dark:text-white">
                                                    {project.title}
                                                </h3>
                                                <a
                                                    href={project.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-surface-900/40 dark:text-surface-200/40 hover:text-accent transition-colors"
                                                    aria-label={`${project.title} GitHub`}
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                    </svg>
                                                </a>
                                            </div>
                                            <p className="text-accent text-sm font-medium mb-3">{project.tagline}</p>
                                            <p className="text-sm text-surface-900/65 dark:text-surface-200/65 leading-relaxed mb-4">
                                                {project.description}
                                            </p>

                                            {/* Tech tags */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.tech.map((t) => (
                                                    <span
                                                        key={t}
                                                        className="px-2 py-0.5 text-xs font-mono rounded-md bg-surface-100 dark:bg-surface-800/60 text-surface-900/70 dark:text-surface-200/60 border border-surface-200/40 dark:border-surface-800/40"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right: metrics */}
                                        <div className="lg:w-56 flex lg:flex-col gap-3">
                                            {project.metrics.map((metric, j) => (
                                                <div
                                                    key={j}
                                                    className="flex-1 lg:flex-none px-4 py-3 rounded-xl bg-surface-100/80 dark:bg-surface-800/40 border border-surface-200/30 dark:border-surface-800/30 text-center"
                                                >
                                                    <span className={`text-sm font-bold bg-gradient-to-r ${project.accent} bg-clip-text text-transparent`}>
                                                        {metric}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom gradient line */}
                                <div className={`h-0.5 bg-gradient-to-r ${project.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                            </motion.div>
                        </RevealOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
}
