import { motion } from 'framer-motion';
import RevealOnScroll from './RevealOnScroll';

const SKILL_CATEGORIES = [
    {
        title: 'Languages',
        icon: '⌘',
        skills: ['Python', 'JavaScript', 'TypeScript', 'C/C++', 'Golang', 'SQL'],
    },
    {
        title: 'Frameworks',
        icon: '◈',
        skills: ['React.js', 'Node.js', 'Express.js', 'FastAPI', 'NestJS', 'Next.js'],
    },
    {
        title: 'GenAI & ML',
        icon: '◉',
        skills: ['LLMs', 'RAG Pipelines', 'LangChain', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'Hugging Face', 'Prompt Engineering', 'Fine-tuning', 'Agentic Workflows (MCP)'],
    },
    {
        title: 'Tools & Infra',
        icon: '⬡',
        skills: ['Docker', 'Git', 'PostgreSQL', 'MongoDB', 'Redis', 'Kafka', 'FAISS', 'MySQL', 'Postman'],
    },
];

export default function Skills() {
    return (
        <section id="skills" className="py-24">
            <div className="section-container">
                <RevealOnScroll>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px flex-1 max-w-[60px] bg-accent/50" />
                        <span className="text-accent font-mono text-sm">02</span>
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold mb-12 text-surface-900 dark:text-white">
                        Tech <span className="heading-gradient">Stack</span>
                    </h2>
                </RevealOnScroll>

                <div className="grid sm:grid-cols-2 gap-6">
                    {SKILL_CATEGORIES.map((category, catIdx) => (
                        <RevealOnScroll key={category.title} delay={catIdx * 0.1}>
                            <div className="glass-card p-6 h-full group hover:border-accent/30 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="text-accent text-xl">{category.icon}</span>
                                    <h3 className="font-display font-semibold text-lg text-surface-900 dark:text-white">
                                        {category.title}
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {category.skills.map((skill, skillIdx) => (
                                        <motion.span
                                            key={skill}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: catIdx * 0.1 + skillIdx * 0.03 }}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            className="px-3 py-1.5 text-sm font-mono rounded-lg bg-surface-100 dark:bg-surface-800/60 text-surface-900/80 dark:text-surface-200/80 border border-surface-200/50 dark:border-surface-800/50 hover:border-accent/40 hover:text-accent dark:hover:text-accent-light transition-all cursor-default"
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
}
