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
            initial={{ opacity: 0, y: 24, x: -20 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
        >
            <TiltCard glowColor={`${config.color}50`} className="h-full">
                <div className="liquid-card rounded-xl sm:rounded-2xl p-4 sm:p-5 h-full group relative overflow-hidden border transition-all duration-300" style={{ borderColor: `${config.color}50` }}>
                    {/* Permanent gradient background */}
                    <motion.div 
                        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-all duration-300" 
                        style={{ background: `linear-gradient(135deg, ${config.color}, transparent)` }}
                        whileHover={{ opacity: 0.25 }}
                    />
                    
                    {/* Glowing corner accent - GLOW ON HOVER */}
                    <div 
                        className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-15 group-hover:opacity-40 transition-all duration-400 blur-2xl group-hover:blur-xl"
                        style={{ background: config.color, boxShadow: `0 0 25px ${config.color}40` }} 
                    />
                    
                    <div className="relative z-10 flex items-start gap-3">
                        <motion.div
                            className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 shadow-lg border transition-all duration-300"
                            style={{ background: `${config.bg}`, borderColor: `${config.color}60` }}
                            whileHover={{ scale: 1.15, rotate: 8, boxShadow: `0 0 15px ${config.color}80` }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <Icon className="w-5.5 h-5.5" style={{ color: config.color }} />
                        </motion.div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-text-primary mb-1.5 leading-tight">{title}</h3>
                            <p className="text-xs text-text-secondary leading-snug line-clamp-2 mb-3">
                                {description}
                            </p>
                            <motion.span
                                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${config.text} border transition-all duration-300`}
                                style={{ background: `${config.bg}cc`, borderColor: `${config.color}60` }}
                                whileHover={{ scale: 1.08, boxShadow: `0 0 12px ${config.color}80` }}
                            >
                                {config.label}
                            </motion.span>
                        </div>
                    </div>
                </div>
            </TiltCard>
        </motion.div>
    );
}
