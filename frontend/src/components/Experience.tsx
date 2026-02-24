import RevealOnScroll from './RevealOnScroll';

const EXPERIENCES = [
    {
        company: 'PearlThoughts',
        role: 'Backend Developer Intern',
        period: 'Jul 2025 – Aug 2025',
        highlights: [
            'Built a production-ready NestJS backend for a patient–doctor appointment system serving 500+ users.',
            'Designed RESTful APIs with validation and centralized error handling, reducing failures by 25%.',
            'Modeled PostgreSQL schemas and managed migrations using TypeORM across 10+ entities.',
            'Implemented JWT-based authentication with role-based access control (RBAC).',
        ],
        tech: ['NestJS', 'TypeORM', 'PostgreSQL', 'JWT', 'RBAC'],
    },
    {
        company: 'Naxcuure Healthcare Pvt Ltd',
        role: 'Full Stack Developer Intern',
        period: 'May 2025 – Jul 2025',
        highlights: [
            'Developed a compliance management system automating regulatory workflows, reducing manual tracking by 40%.',
            'Built secure MERN modules supporting 100+ compliance records with real-time dashboards.',
            'Designed REST APIs and authentication flows; optimized queries to improve response times by 30%.',
            'Collaborated with cross-functional teams to meet healthcare compliance standards.',
        ],
        tech: ['React', 'Node.js', 'MongoDB', 'Express', 'REST APIs'],
    },
];

export default function Experience() {
    return (
        <section id="experience" className="py-24 relative">
            <div className="absolute inset-0 bg-gradient-mesh-light dark:bg-gradient-mesh pointer-events-none" />

            <div className="section-container relative">
                <RevealOnScroll>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px flex-1 max-w-[60px] bg-accent/50" />
                        <span className="text-accent font-mono text-sm">03</span>
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold mb-12 text-surface-900 dark:text-white">
                        Work <span className="heading-gradient">Experience</span>
                    </h2>
                </RevealOnScroll>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent/50 via-primary-500/30 to-transparent" />

                    {EXPERIENCES.map((exp, i) => (
                        <RevealOnScroll
                            key={i}
                            delay={i * 0.15}
                            direction={i % 2 === 0 ? 'left' : 'right'}
                        >
                            <div
                                className={`relative flex flex-col md:flex-row items-start gap-8 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                            >
                                {/* Timeline dot */}
                                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent shadow-lg shadow-accent/30 mt-6 z-10" />

                                {/* Date (desktop) */}
                                <div
                                    className={`hidden md:block md:w-1/2 ${i % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'
                                        }`}
                                >
                                    <span className="font-mono text-sm text-accent">{exp.period}</span>
                                </div>

                                {/* Card */}
                                <div className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                                    <div className="glass-card p-6 hover:border-accent/30 transition-all duration-300">
                                        <span className="md:hidden font-mono text-xs text-accent block mb-2">
                                            {exp.period}
                                        </span>
                                        <h3 className="font-display font-bold text-xl text-surface-900 dark:text-white mb-1">
                                            {exp.company}
                                        </h3>
                                        <p className="text-accent font-medium text-sm mb-4">{exp.role}</p>

                                        <ul className="space-y-2 mb-4">
                                            {exp.highlights.map((h, j) => (
                                                <li
                                                    key={j}
                                                    className="flex items-start gap-2 text-sm text-surface-900/70 dark:text-surface-200/70"
                                                >
                                                    <span className="text-accent mt-1 text-xs">▸</span>
                                                    {h}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="flex flex-wrap gap-1.5">
                                            {exp.tech.map((t) => (
                                                <span
                                                    key={t}
                                                    className="px-2 py-0.5 text-xs font-mono rounded-md bg-accent/10 text-accent border border-accent/20"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
}
