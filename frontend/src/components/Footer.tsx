export default function Footer() {
    return (
        <footer className="py-8 border-t border-surface-200/30 dark:border-surface-800/30">
            <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-primary-600 flex items-center justify-center text-white font-display font-bold text-xs">
                        A
                    </div>
                    <span className="font-display font-semibold text-sm text-surface-900 dark:text-white">
                        Aman Paswan
                    </span>
                </div>

                <p className="text-xs text-surface-900/40 dark:text-surface-200/40 font-mono">
                    © {new Date().getFullYear()} — Built with React, FastAPI & a RAG pipeline
                </p>

                <div className="flex items-center gap-3">
                    {[
                        { href: 'https://github.com/aman0603', label: 'GitHub' },
                        { href: 'https://linkedin.com/in/aman-paswan-0b06311bb', label: 'LinkedIn' },
                        { href: 'mailto:amanpaswan464@gmail.com', label: 'Email' },
                    ].map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target={link.href.startsWith('http') ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            className="text-xs text-surface-900/40 dark:text-surface-200/40 hover:text-accent transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
