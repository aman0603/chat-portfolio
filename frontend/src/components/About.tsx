import RevealOnScroll from './RevealOnScroll';

export default function About() {
    return (
        <section id="about" className="py-24 relative">
            <div className="absolute inset-0 bg-gradient-mesh-light dark:bg-gradient-mesh pointer-events-none" />

            <div className="section-container relative">
                <RevealOnScroll>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px flex-1 max-w-[60px] bg-accent/50" />
                        <span className="text-accent font-mono text-sm">01</span>
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold mb-12 text-surface-900 dark:text-white">
                        About <span className="heading-gradient">Me</span>
                    </h2>
                </RevealOnScroll>

                <div className="grid md:grid-cols-5 gap-8 items-start">
                    {/* Main card */}
                    <RevealOnScroll className="md:col-span-3" delay={0.1}>
                        <div className="glass-card p-6 sm:p-8">
                            <p className="text-surface-900/70 dark:text-surface-200/70 leading-relaxed mb-4">
                                I'm a final-year B.Tech Computer Science student at{' '}
                                <span className="text-accent font-semibold">Jaypee Institute of Information Technology, Noida</span>{' '}
                                (2022–2026), passionate about building intelligent backend systems and exploring the
                                frontier of Generative AI.
                            </p>
                            <p className="text-surface-900/70 dark:text-surface-200/70 leading-relaxed mb-4">
                                My focus areas include designing <span className="text-primary-600 dark:text-primary-400 font-medium">RAG pipelines</span>,{' '}
                                <span className="text-primary-600 dark:text-primary-400 font-medium">agentic workflows</span>,
                                and <span className="text-primary-600 dark:text-primary-400 font-medium">production-grade APIs</span>{' '}
                                that solve real problems. I've worked on AI systems predicting disease outbreaks,
                                voice-powered RAG agents, and OSINT-enhanced sales intelligence platforms.
                            </p>
                            <p className="text-surface-900/70 dark:text-surface-200/70 leading-relaxed">
                                When I'm not coding, I'm exploring new LLM frameworks, contributing to open source,
                                or diving deep into distributed systems architecture.
                            </p>
                        </div>
                    </RevealOnScroll>

                    {/* Stats */}
                    <RevealOnScroll className="md:col-span-2" delay={0.2} direction="right">
                        <div className="space-y-4">
                            {[
                                { label: 'Internships', value: '2+', detail: 'Full Stack & Backend' },
                                { label: 'Projects', value: '5+', detail: 'AI / GenAI focused' },
                                { label: 'Tech Stack', value: '15+', detail: 'Languages & Frameworks' },
                                { label: 'Focus', value: 'GenAI', detail: 'RAG, Agents, LLMs' },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="glass-card p-4 flex items-center gap-4 group hover:border-accent/30 transition-colors"
                                >
                                    <div className="text-2xl font-display font-bold text-accent min-w-[60px]">
                                        {stat.value}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-surface-900 dark:text-white text-sm">
                                            {stat.label}
                                        </div>
                                        <div className="text-xs text-surface-900/50 dark:text-surface-200/50">
                                            {stat.detail}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </section>
    );
}
