import { motion } from 'framer-motion';
import { Lightbulb, Zap, Edit3, TrendingUp, Code, Search, Layout, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import TiltCard from '../components/TiltCard';

const iconMap: Record<string, any> = {
    zap: Zap, edit: Edit3, 'trending-up': TrendingUp, code: Code, search: Search, layout: Layout,
};

const priorityConfig = {
    high: { color: '#f87171', bg: 'rgba(248, 113, 113, 0.08)', border: 'rgba(248, 113, 113, 0.15)', text: 'text-neon-red', label: 'High' },
    medium: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.08)', border: 'rgba(251, 191, 36, 0.15)', text: 'text-neon-amber', label: 'Medium' },
    low: { color: '#34d399', bg: 'rgba(52, 211, 153, 0.08)', border: 'rgba(52, 211, 153, 0.15)', text: 'text-neon-green', label: 'Low' },
};

export default function SuggestionsSection() {
    const { analysisResult } = useStore();
    if (!analysisResult) return null;

    return (
        <section className="relative py-16 sm:py-20 lg:py-28">
            <div className="absolute top-1/2 left-0 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-neon-purple/4 rounded-full blur-[150px] sm:blur-[200px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10 sm:mb-14 lg:mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-pill mb-5 sm:mb-6">
                        <Lightbulb className="w-3.5 h-3.5 text-neon-amber" />
                        <span className="text-xs sm:text-sm font-medium text-neon-amber">AI Suggestions</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4">
                        Improve Your <span className="text-gradient">Resume</span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-text-secondary max-w-xl sm:max-w-2xl mx-auto">
                        Personalized recommendations from our AI to help you stand out.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                    {analysisResult.suggestions.map((suggestion, index) => {
                        const Icon = iconMap[suggestion.icon] || Lightbulb;
                        const priority = priorityConfig[suggestion.priority];

                        return (
                            <motion.div
                                key={suggestion.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                            >
                                <TiltCard glowColor={`${priority.color}12`} className="h-full">
                                    <div className="liquid-card rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 h-full group">
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <div
                                                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                                                style={{ background: priority.bg }}
                                            >
                                                <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: priority.color }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5 sm:mb-2 flex-wrap">
                                                    <h3 className="text-sm sm:text-base font-semibold text-text-primary">{suggestion.title}</h3>
                                                    <span
                                                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${priority.text}`}
                                                        style={{ background: priority.bg, border: `1px solid ${priority.border}` }}
                                                    >
                                                        {priority.label}
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{suggestion.description}</p>
                                                <motion.button
                                                    whileHover={{ x: 3 }}
                                                    className="mt-2.5 sm:mt-3 flex items-center gap-1 text-xs sm:text-sm font-medium text-neon-blue hover:text-neon-cyan transition-colors"
                                                >
                                                    Learn more <ChevronRight className="w-3.5 h-3.5" />
                                                </motion.button>
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
