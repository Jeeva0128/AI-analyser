import { motion } from 'framer-motion';
import TiltCard from './TiltCard';

interface StatCardProps {
    title: string;
    value: number;
    icon?: React.ReactNode;
    color: string;
    subtext?: string;
    index?: number;
}

export default function StatCard({
    title,
    value,
    icon,
    color,
    subtext,
    index = 0,
}: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <TiltCard glowColor={`${color}12`}>
                <div className="liquid-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-7">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-xs sm:text-sm text-text-muted font-medium uppercase tracking-wider mb-1">
                                {title}
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span
                                    className="text-3xl sm:text-4xl font-bold"
                                    style={{
                                        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {value}
                                </span>
                                <span className="text-xl sm:text-2xl text-text-muted">%</span>
                            </div>
                        </div>
                        {icon && <div className="text-text-muted opacity-40">{icon}</div>}
                    </div>

                    {subtext && <p className="text-xs sm:text-sm text-text-secondary">{subtext}</p>}

                    {/* Animated bottom accent */}
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: color }}
                                initial={{ width: '0%' }}
                                whileInView={{ width: `${value}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                </div>
            </TiltCard>
        </motion.div>
    );
}
