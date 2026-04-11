import { motion } from 'framer-motion';
import { ChevronRight, LucideIcon } from 'lucide-react';
import TiltCard from './TiltCard';

type PriorityType = 'high' | 'medium' | 'low';

const priorityConfig: Record<PriorityType, { color: string; bg: string; border: string; text: string; label: string }> = {
    high: {
        color: '#f87171',
        bg: 'rgba(248, 113, 113, 0.08)',
        border: 'rgba(248, 113, 113, 0.15)',
        text: 'text-neon-red',
        label: 'High',
    },
    medium: {
        color: '#fbbf24',
        bg: 'rgba(251, 191, 36, 0.08)',
        border: 'rgba(251, 191, 36, 0.15)',
        text: 'text-neon-amber',
        label: 'Medium',
    },
    low: {
        color: '#34d399',
        bg: 'rgba(52, 211, 153, 0.08)',
        border: 'rgba(52, 211, 153, 0.15)',
        text: 'text-neon-green',
        label: 'Low',
    },
};

interface SuggestionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    priority?: PriorityType;
    index?: number;
}

export default function SuggestionCard({
    title,
    description,
    icon: Icon,
    priority = 'medium',
    index = 0,
}: SuggestionCardProps) {
    const config = priorityConfig[priority];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
        >
            <TiltCard glowColor={`${config.color}12`} className="h-full">
                <div className="liquid-card rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 h-full group">
                    <div className="flex items-start gap-3 sm:gap-4">
                        <div
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                            style={{ background: config.bg }}
                        >
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: config.color }} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 sm:mb-2 flex-wrap">
                                <h3 className="text-sm sm:text-base font-semibold text-text-primary">{title}</h3>
                                <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${config.text}`}
                                    style={{ background: config.bg, border: `1px solid ${config.border}` }}
                                >
                                    {config.label}
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-2">
                                {description}
                            </p>

                            <motion.button
                                whileHover={{ x: 3 }}
                                className="mt-3 sm:mt-4 flex items-center gap-1 text-xs sm:text-sm font-medium text-neon-blue hover:text-neon-cyan transition-colors"
                            >
                                Learn more <ChevronRight className="w-3.5 h-3.5" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </TiltCard>
        </motion.div>
    );
}
