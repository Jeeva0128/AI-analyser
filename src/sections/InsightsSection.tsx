import { motion } from 'framer-motion';
import { Eye, Briefcase, Target, FileCheck, SpellCheck, Flame } from 'lucide-react';
import { useStore } from '../store/useStore';
import TiltCard from '../components/TiltCard';

const insightMeta = [
    { key: 'keywordMatch', label: 'Keyword Match', icon: Target, color: '#6366f1', description: 'How well your keywords match industry standards' },
    { key: 'formatting', label: 'Formatting', icon: FileCheck, color: '#8b5cf6', description: 'Resume structure and visual organization' },
    { key: 'grammar', label: 'Grammar & Style', icon: SpellCheck, color: '#22d3ee', description: 'Writing quality and professional tone' },
    { key: 'impact', label: 'Impact Score', icon: Flame, color: '#f472b6', description: 'How compelling your achievements sound' },
    { key: 'roleFit', label: 'Role Fit', icon: Briefcase, color: '#34d399', description: 'Alignment with target job requirements' },
] as const;

export default function InsightsSection() {
    const { analysisResult } = useStore();
    if (!analysisResult) return null;

    return (
        <section className="relative py-16 sm:py-20 lg:py-28">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[300px] sm:h-[400px] bg-neon-blue/4 rounded-full blur-[150px] sm:blur-[200px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10 sm:mb-14 lg:mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-pill mb-5 sm:mb-6">
                        <Eye className="w-3.5 h-3.5 text-neon-green" />
                        <span className="text-xs sm:text-sm font-medium text-neon-green">Deep Insights</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4">
                        Resume <span className="text-gradient">Insights</span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-text-secondary max-w-xl sm:max-w-2xl mx-auto">
                        Detailed breakdown of every aspect of your resume performance.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                    {/* Experience card */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="col-span-2 lg:col-span-1"
                    >
                        <TiltCard glowColor="rgba(251, 191, 36, 0.12)" className="h-full">
                            <div className="liquid-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 h-full flex flex-col items-center justify-center text-center">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-3 sm:mb-4" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
                                    <Briefcase className="w-7 h-7 sm:w-8 sm:h-8 text-neon-amber" />
                                </div>
                                <div className="text-4xl sm:text-5xl font-bold text-gradient mb-1 sm:mb-2">{analysisResult.insights.experienceYears}</div>
                                <div className="text-base sm:text-lg font-semibold text-text-primary">Years Experience</div>
                                <div className="text-xs sm:text-sm text-text-muted mt-1">Detected from your resume</div>
                                <div className="mt-3 sm:mt-4 px-4 py-2 rounded-xl liquid-pill" style={{ borderColor: 'rgba(251, 191, 36, 0.15)' }}>
                                    <span className="text-xs sm:text-sm font-medium text-neon-amber">Mid-Senior Level</span>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* Insight cards */}
                    {insightMeta.map((insight, index) => {
                        const value = analysisResult.insights[insight.key as keyof typeof analysisResult.insights] as number;
                        return (
                            <motion.div
                                key={insight.key}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: (index + 1) * 0.08 }}
                            >
                                <TiltCard glowColor={`${insight.color}12`} className="h-full">
                                    <div className="liquid-card rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 h-full group">
                                        <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${insight.color}12` }}>
                                                <insight.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: insight.color }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs sm:text-sm font-semibold text-text-primary truncate">{insight.label}</div>
                                            </div>
                                            <div className="text-xl sm:text-2xl font-bold shrink-0" style={{ color: insight.color }}>
                                                {value}%
                                            </div>
                                        </div>

                                        <div className="h-1.5 sm:h-2 rounded-full bg-white/5 overflow-hidden mb-2.5 sm:mb-3">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ background: `linear-gradient(90deg, ${insight.color}, ${insight.color}80)` }}
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${value}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: 0.3 + index * 0.08 }}
                                            />
                                        </div>
                                        <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">{insight.description}</p>

                                        {/* Hover tooltip */}
                                        <div className="mt-2 sm:mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="text-[11px] sm:text-xs text-text-secondary p-2 rounded-lg liquid-glass-subtle">
                                                {value >= 80 ? '✅ Excellent - Keep it up!' : value >= 60 ? '⚡ Good - Room for improvement' : '⚠️ Needs attention'}
                                            </div>
                                        </div>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
