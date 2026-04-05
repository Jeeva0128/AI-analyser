import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Zap, Star } from 'lucide-react';
import ParticleField from '../components/ParticleField';
import TiltCard from '../components/TiltCard';

export default function HeroSection() {
    const scrollToUpload = () => {
        const el = document.getElementById('upload');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-8 md:pt-16 md:pb-0">
            <ParticleField />

            {/* Ambient gradient blobs */}
            <div className="absolute inset-0 -z-5 overflow-hidden">
                <div className="absolute top-[15%] left-[10%] w-72 sm:w-96 h-72 sm:h-96 bg-neon-blue/8 rounded-full blur-[100px] sm:blur-[140px]" />
                <div className="absolute bottom-[20%] right-[10%] w-72 sm:w-96 h-72 sm:h-96 bg-neon-purple/8 rounded-full blur-[100px] sm:blur-[140px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-neon-cyan/4 rounded-full blur-[120px] sm:blur-[180px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 w-full">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Left content */}
                    <div className="text-center lg:text-left order-2 lg:order-1">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-pill mb-6 sm:mb-8"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
                            <span className="text-xs sm:text-sm font-medium text-neon-cyan">Powered by Advanced AI</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight mb-5 sm:mb-6"
                        >
                            Analyze Your{' '}
                            <br className="hidden sm:block" />
                            Resume with{' '}
                            <span className="text-gradient">AI Precision</span>
                        </motion.h1>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="text-base sm:text-lg md:text-xl text-text-secondary max-w-lg mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed"
                        >
                            Get instant feedback, ATS compatibility scores, and personalized improvement suggestions to land your dream job.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start"
                        >
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={scrollToUpload}
                                className="group relative w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-semibold text-white bg-gradient-main overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Upload Resume
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute -inset-2 rounded-2xl bg-gradient-main blur-2xl opacity-25 group-hover:opacity-40 transition-opacity" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-semibold text-text-primary liquid-glass hover:border-neon-blue/20 transition-all"
                            >
                                Watch Demo
                            </motion.button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                            className="flex items-center gap-6 sm:gap-10 mt-10 sm:mt-12 justify-center lg:justify-start"
                        >
                            {[
                                { value: '50K+', label: 'Resumes Analyzed' },
                                { value: '95%', label: 'Accuracy Rate' },
                                { value: '3s', label: 'Avg. Analysis' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-xl sm:text-2xl font-bold text-gradient">{stat.value}</div>
                                    <div className="text-[10px] sm:text-xs text-text-muted mt-0.5">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right side - 3D Liquid Glass Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.3 }}
                        className="flex justify-center order-1 lg:order-2"
                    >
                        <TiltCard className="w-full max-w-sm sm:max-w-md" glowColor="rgba(99, 102, 241, 0.15)">
                            <div className="liquid-card-elevated rounded-2xl sm:rounded-3xl p-5 sm:p-6 relative overflow-hidden">
                                {/* Scan line */}
                                <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" style={{ animation: 'scan-line 3.5s ease-in-out infinite' }} />

                                {/* Resume preview */}
                                <div className="relative">
                                    <img src="/images/hero-resume.png" alt="AI Resume Analysis" className="w-full rounded-xl sm:rounded-2xl opacity-85" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/95 via-bg-primary/20 to-transparent rounded-xl sm:rounded-2xl" />

                                    {/* Floating liquid glass badges */}
                                    <motion.div
                                        animate={{ y: [-4, 4, -4] }}
                                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                                        className="absolute top-3 right-3 liquid-pill rounded-xl px-3 py-1.5 flex items-center gap-1.5"
                                    >
                                        <Shield className="w-3.5 h-3.5 text-neon-green" />
                                        <span className="text-[11px] font-semibold text-neon-green">ATS Ready</span>
                                    </motion.div>

                                    <motion.div
                                        animate={{ y: [4, -4, 4] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                        className="absolute bottom-14 left-3 liquid-pill rounded-xl px-3 py-1.5 flex items-center gap-1.5"
                                    >
                                        <Zap className="w-3.5 h-3.5 text-neon-amber" />
                                        <span className="text-[11px] font-semibold text-text-primary">Score: 85/100</span>
                                    </motion.div>

                                    <motion.div
                                        animate={{ y: [-3, 5, -3] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                                        className="absolute top-1/2 right-3 liquid-pill rounded-xl px-3 py-1.5 flex items-center gap-1.5"
                                    >
                                        <Star className="w-3.5 h-3.5 text-neon-purple" />
                                        <span className="text-[11px] font-semibold text-neon-purple">Top 15%</span>
                                    </motion.div>
                                </div>

                                {/* Bottom info */}
                                <div className="mt-4 flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-semibold text-text-primary">AI Analysis Complete</div>
                                        <div className="text-xs text-text-muted mt-0.5">12 suggestions found</div>
                                    </div>
                                    <div className="flex -space-x-2">
                                        {[
                                            { bg: 'from-neon-blue to-indigo-600', letter: 'R' },
                                            { bg: 'from-neon-purple to-violet-600', letter: 'S' },
                                            { bg: 'from-neon-cyan to-teal-500', letter: 'A' },
                                        ].map((c, i) => (
                                            <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${c.bg} border-2 border-bg-primary/80 flex items-center justify-center`}>
                                                <span className="text-[10px] text-white font-bold">{c.letter}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
