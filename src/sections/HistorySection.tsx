import { motion } from 'framer-motion';
import { Clock, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import TiltCard from '../components/TiltCard';

export default function HistorySection() {
    const { uploadHistory } = useStore();

    return (
        <section className="relative py-16 sm:py-20 lg:py-28">
            <div className="absolute top-0 right-0 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-neon-purple/4 rounded-full blur-[150px] sm:blur-[200px]" />

            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10 sm:mb-14 lg:mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-pill mb-5 sm:mb-6">
                        <Clock className="w-3.5 h-3.5 text-neon-purple" />
                        <span className="text-xs sm:text-sm font-medium text-neon-purple">History</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4">
                        Your <span className="text-gradient">Progress</span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-text-secondary max-w-xl sm:max-w-2xl mx-auto">
                        Track your improvement over time and see how your resume evolves.
                    </p>
                </motion.div>

                <div className="space-y-3 sm:space-y-4">
                    {uploadHistory.map((entry, index) => {
                        const prevScore = uploadHistory[index + 1]?.score;
                        const scoreDiff = prevScore ? entry.score - prevScore : 0;

                        return (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, x: -24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                            >
                                <TiltCard glowColor="rgba(99, 102, 241, 0.08)" tiltAmount={4}>
                                    <div className="liquid-card rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl liquid-glass flex items-center justify-center shrink-0 animate-liquid-border">
                                            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-neon-blue" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs sm:text-sm font-semibold text-text-primary truncate">{entry.fileName}</div>
                                            <div className="text-[11px] sm:text-xs text-text-muted mt-0.5">{entry.date}</div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                            {scoreDiff !== 0 && (
                                                <div className={`flex items-center gap-0.5 sm:gap-1 text-[11px] sm:text-xs font-medium ${scoreDiff > 0 ? 'text-neon-green' : 'text-neon-red'
                                                    }`}>
                                                    {scoreDiff > 0 ? <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                                                    {scoreDiff > 0 ? '+' : ''}{scoreDiff}
                                                </div>
                                            )}
                                            <div className={`text-xl sm:text-2xl font-bold ${entry.score >= 80 ? 'text-neon-green' : entry.score >= 60 ? 'text-neon-amber' : 'text-neon-red'
                                                }`}>
                                                {entry.score}
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
