import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import TiltCard from './TiltCard';

interface ScoreCardProps {
    label: string;
    value: number;
    icon: LucideIcon;
    color: string;
    index?: number;
}

export default function ScoreCard({ label, value, icon: Icon, color, index = 0 }: ScoreCardProps) {
    const getStatus = (score: number) => {
        if (score >= 80) return { text: 'Excellent', color: 'text-emerald-400' };
        if (score >= 60) return { text: 'Good', color: 'text-sky-400' };
        return { text: 'Needs Work', color: 'text-amber-400' };
    };

    const status = getStatus(value);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
        >
            <TiltCard glowColor={`${color}15`}>
                <div className="liquid-card rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}12` }}>
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
                        </div>
                        <span className={`text-[10px] sm:text-xs font-semibold ${status.color}`}>{status.text}</span>
                    </div>

                    <div className="text-2xl sm:text-3xl font-bold text-text-primary mb-0.5 sm:mb-1">
                        {value}<span className="text-base sm:text-lg text-text-muted">%</span>
                    </div>

                    <div className="text-xs sm:text-sm text-text-secondary mb-3 sm:mb-4">{label}</div>

                    {/* Animated progress bar */}
                    <div className="h-1 sm:h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4 + index * 0.1 }}
                        />
                    </div>
                </div>
            </TiltCard>
        </motion.div>
    );
}
