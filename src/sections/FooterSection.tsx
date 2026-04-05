import { motion } from 'framer-motion';
import { Brain, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function FooterSection() {
    return (
        <footer className="relative border-t border-white/5 pb-24 md:pb-0">
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
                    {/* Brand */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <span className="text-base sm:text-lg font-bold text-text-primary">
                                AI Resume<span className="text-gradient"> Analyzer</span>
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-text-secondary max-w-xs sm:max-w-sm leading-relaxed mb-5 sm:mb-6">
                            Empowering job seekers with AI-driven resume analysis. Get the edge you need to land your dream job.
                        </p>
                        <div className="flex items-center gap-2.5 sm:gap-3">
                            {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl liquid-glass-subtle flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                                >
                                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-text-primary mb-3 sm:mb-4 uppercase tracking-wider">Product</h4>
                        <ul className="space-y-2.5 sm:space-y-3">
                            {['Features', 'Pricing', 'API', 'Changelog'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-xs sm:text-sm text-text-secondary hover:text-text-primary transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-text-primary mb-3 sm:mb-4 uppercase tracking-wider">Company</h4>
                        <ul className="space-y-2.5 sm:space-y-3">
                            {['About', 'Blog', 'Careers', 'Contact'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-xs sm:text-sm text-text-secondary hover:text-text-primary transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    <p className="text-[11px] sm:text-xs text-text-muted">© 2025 AI Resume Analyzer. All rights reserved.</p>
                    <div className="flex items-center gap-4 sm:gap-6">
                        {['Privacy', 'Terms', 'Cookies'].map((link) => (
                            <a key={link} href="#" className="text-[11px] sm:text-xs text-text-muted hover:text-text-primary transition-colors">{link}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
